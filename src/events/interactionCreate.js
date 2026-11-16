const {
  ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  EmbedBuilder
} = require("discord.js");
const db = require("../database/store");
const config = require("../config");

async function logTicket(guild, message) {
  const channel = config.channels.ticketLogs ? guild.channels.cache.get(config.channels.ticketLogs) : null;
  if (channel) await channel.send({ content: message }).catch(() => {});
}

module.exports = {
 name: "interactionCreate",
 async execute(i, client) {
  if (i.isChatInputCommand()) {
   const command = client.commands.get(i.commandName);
   if (!command) return;
   try { await command.execute(i, client); }
   catch (error) {
    console.error(`Error en /${i.commandName}:`, error);
    const payload = { content: "Ocurrió un error al ejecutar este comando. Revisa la consola y los permisos del bot.", ephemeral: true };
    if (i.replied || i.deferred) await i.followUp(payload).catch(() => {});
    else await i.reply(payload).catch(() => {});
   }
   return;
  }

  if (!i.isButton()) return;

  if (i.customId === "suggest_up" || i.customId === "suggest_down") {
   const entry = db.all().suggestions[i.message.id];
   if (!entry) return i.reply({ content: "Esta sugerencia ya no está disponible.", ephemeral: true });
   const up = i.customId === "suggest_up";
   if ((up ? entry.up : entry.down).includes(i.user.id)) return i.reply({ content: "Ya registraste ese voto.", ephemeral: true });
   entry.up = entry.up.filter(id => id !== i.user.id);
   entry.down = entry.down.filter(id => id !== i.user.id);
   (up ? entry.up : entry.down).push(i.user.id);
   db.save();
   const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("suggest_up").setLabel(`👍 ${entry.up.length}`).setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("suggest_down").setLabel(`👎 ${entry.down.length}`).setStyle(ButtonStyle.Danger)
   );
   return i.update({ components: [row] });
  }

  if (i.customId === "ticket:open") {
   const existing = Object.values(db.all().tickets).find(t => t.guildId === i.guildId && t.userId === i.user.id && t.status === "open");
   if (existing) {
    const existingChannel = i.guild.channels.cache.get(existing.channelId);
    return i.reply({ content: existingChannel ? `Ya tienes un ticket abierto: ${existingChannel}` : "Ya tienes un ticket abierto. Contacta con el equipo.", ephemeral: true });
   }
   const category = config.channels.ticketCategory;
   if (!category) return i.reply({ content: "El sistema de tickets no está configurado. Falta TICKETS_CATEGORY_ID.", ephemeral: true });
   await i.deferReply({ ephemeral: true });
   const safeName = i.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 15) || "usuario";
   const channel = await i.guild.channels.create({
    name: `ticket-${safeName}`,
    type: ChannelType.GuildText,
    parent: category,
    permissionOverwrites: [
     { id: i.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
     { id: i.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles] },
     ...(config.roles.staff ? [{ id: config.roles.staff, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }] : []),
     { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels] }
    ]
   });
   db.all().tickets[channel.id] = { guildId: i.guildId, channelId: channel.id, userId: i.user.id, status: "open", createdAt: Date.now() };
   db.save();
   const closeRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ticket:close").setLabel("Cerrar ticket").setEmoji("🔒").setStyle(ButtonStyle.Danger));
   await channel.send({ content: `Hola ${i.user}, explica aquí cómo podemos ayudarte.${config.roles.staff ? ` <@&${config.roles.staff}>` : ""}`, components: [closeRow], allowedMentions: { users: [i.user.id], roles: config.roles.staff ? [config.roles.staff] : [] } });
   await logTicket(i.guild, `🎫 Ticket creado: ${channel} por ${i.user.tag} (${i.user.id})`);
   return i.editReply({ content: `✅ Tu ticket fue creado: ${channel}` });
  }

  if (i.customId === "ticket:close") {
   const ticket = db.all().tickets[i.channelId];
   if (!ticket || ticket.status !== "open") return i.reply({ content: "Este canal no figura como un ticket abierto.", ephemeral: true });
   const isOwner = ticket.userId === i.user.id;
   const isStaff = i.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels) || (config.roles.staff && i.member.roles?.cache?.has(config.roles.staff));
   if (!isOwner && !isStaff) return i.reply({ content: "Solo quien abrió el ticket o el equipo autorizado puede cerrarlo.", ephemeral: true });
   ticket.status = "closed"; ticket.closedAt = Date.now(); ticket.closedBy = i.user.id; db.save();
   await logTicket(i.guild, `🔒 Ticket cerrado: #${i.channel.name} por ${i.user.tag}`);
   await i.reply({ content: "🔒 Ticket cerrado. Este canal se eliminará en unos segundos." });
   setTimeout(() => i.channel.delete("Ticket cerrado").catch(() => {}), 5000);
   return;
  }

  if (i.customId === "giveaway:join") {
   const giveaway = db.all().giveaways[i.message.id];
   if (!giveaway || giveaway.ended || Date.now() >= giveaway.endAt) return i.reply({ content: "Este sorteo ya terminó.", ephemeral: true });
   if (giveaway.entrants.includes(i.user.id)) return i.reply({ content: "Ya estás participando en este sorteo.", ephemeral: true });
   giveaway.entrants.push(i.user.id); db.save();
   return i.reply({ content: "🎉 ¡Ya estás participando!", ephemeral: true });
  }
 }
};