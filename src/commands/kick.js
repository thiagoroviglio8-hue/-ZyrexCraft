const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("kick").setDescription("Expulsa a un miembro.")
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption(o => o.setName("usuario").setDescription("Miembro a expulsar").setRequired(true))
  .addStringOption(o => o.setName("motivo").setDescription("Motivo").setMaxLength(500)),
 async execute(i) {
  const user = i.options.getUser("usuario"), member = await i.guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.kickable) return i.reply({ content: "No puedo expulsar a ese miembro. Revisa la jerarquía de roles.", ephemeral: true });
  const reason = i.options.getString("motivo") || "Sin motivo indicado";
  await member.kick(`${reason} | Moderador: ${i.user.tag}`);
  await i.reply(`👢 ${user.tag} fue expulsado. Motivo: **${reason}**`);
 }
};