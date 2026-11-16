const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("ban").setDescription("Banea a un miembro del servidor.")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption(o => o.setName("usuario").setDescription("Miembro a banear").setRequired(true))
  .addStringOption(o => o.setName("motivo").setDescription("Motivo del baneo").setMaxLength(500)),
 async execute(i) {
  const user = i.options.getUser("usuario"), reason = i.options.getString("motivo") || "Sin motivo indicado";
  if (user.id === i.user.id) return i.reply({ content: "No puedes banearte a ti mismo.", ephemeral: true });
  await i.guild.members.ban(user, { reason: `${reason} | Moderador: ${i.user.tag}` });
  await i.reply(`🔨 ${user.tag} fue baneado. Motivo: **${reason}**`);
 }
};