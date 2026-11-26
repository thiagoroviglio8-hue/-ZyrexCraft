const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../database/store");

module.exports = {
 data: new SlashCommandBuilder().setName("sorteo").setDescription("Crea o finaliza un sorteo de CircuMC.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(s => s.setName("crear").setDescription("Inicia un sorteo").addStringOption(o => o.setName("premio").setDescription("Premio").setRequired(true).setMaxLength(150)).addIntegerOption(o => o.setName("minutos").setDescription("Duración en minutos").setRequired(true).setMinValue(1).setMaxValue(10080)).addIntegerOption(o => o.setName("ganadores").setDescription("Número de ganadores").setRequired(true).setMinValue(1).setMaxValue(20)))
  .addSubcommand(s => s.setName("terminar").setDescription("Finaliza un sorteo por ID de mensaje").addStringOption(o => o.setName("mensaje_id").setDescription("ID del mensaje del sorteo").setRequired(true)))
  .addSubcommand(s => s.setName("reroll").setDescription("Elige otro ganador de un sorteo finalizado").addStringOption(o => o.setName("mensaje_id").setDescription("ID del mensaje del sorteo").setRequired(true))),
 async execute(i) {
  if (i.options.getSubcommand() === "crear") {
   const prize = i.options.getString("premio"), minutes = i.options.getInteger("minutos"), winners = i.options.getInteger("ganadores");
   const endAt = Date.now() + minutes * 60000;
   const embed = new EmbedBuilder().setColor(0x1677FF).setTitle("🎉 SORTEO CIRCUMC").setDescription(`**Premio:** ${prize}\n**Ganadores:** ${winners}\n**Finaliza:** <t:${Math.floor(endAt / 1000)}:R>\n\nPulsa participar para entrar.`).setFooter({ text: "CircuMC • ¡Mucha suerte!" });
   const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("giveaway:join").setLabel("Participar").setEmoji("🎉").setStyle(ButtonStyle.Success));
   const msg = await i.channel.send({ embeds: [embed], components: [row] });
   db.all().giveaways[msg.id] = { prize, winners, endAt, entrants: [], ended: false, channelId: i.channelId, guildId: i.guildId };
   db.save();
   return i.reply({ content: `✅ Sorteo creado. ID del mensaje: ${msg.id}`, ephemeral: true });
  }
  const id = i.options.getString("mensaje_id"), giveaway = db.all().giveaways[id];
  if (!giveaway || giveaway.guildId !== i.guildId) return i.reply({ content: "No encuentro ese sorteo en este servidor.", ephemeral: true });
  const reroll = i.options.getSubcommand() === "reroll";
  if (reroll && !giveaway.ended) return i.reply({ content: "Primero debes finalizar el sorteo.", ephemeral: true });
  if (!reroll && giveaway.ended) return i.reply({ content: "Ese sorteo ya terminó.", ephemeral: true });
  giveaway.ended = true;
  db.save();
  const entrants = giveaway.entrants;
  const winners = entrants.slice().sort(() => Math.random() - 0.5).slice(0, giveaway.winners);
  const channel = i.guild.channels.cache.get(giveaway.channelId);
  const original = await channel?.messages.fetch(id).catch(() => null);
  if (original) await original.edit({ components: [] }).catch(() => {});
  if (!winners.length) await channel?.send(`🎉 El sorteo de **${giveaway.prize}** no tiene participantes.`);
  else await channel?.send(`🎉 ${reroll ? "Nuevo(s) ganador(es)" : "Ganador(es)"} de **${giveaway.prize}**: ${winners.map(id => `<@${id}>`).join(", ")}`);
  await i.reply({ content: reroll ? "✅ Se eligió otro ganador." : "✅ Sorteo finalizado.", ephemeral: true });
 }
};