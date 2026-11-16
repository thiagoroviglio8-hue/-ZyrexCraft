const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("timeout").setDescription("Aplica un tiempo de espera a un miembro.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(o => o.setName("usuario").setDescription("Miembro").setRequired(true))
  .addIntegerOption(o => o.setName("minutos").setDescription("Duración en minutos (1 a 40320)").setMinValue(1).setMaxValue(40320).setRequired(true))
  .addStringOption(o => o.setName("motivo").setDescription("Motivo").setMaxLength(500)),
 async execute(i) {
  const user = i.options.getUser("usuario"), member = await i.guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.moderatable) return i.reply({ content: "No puedo aplicar timeout a ese miembro.", ephemeral: true });
  const minutes = i.options.getInteger("minutos"), reason = i.options.getString("motivo") || "Sin motivo indicado";
  await member.timeout(minutes * 60000, `${reason} | Moderador: ${i.user.tag}`);
  await i.reply(`⏳ ${user.tag} recibió timeout de **${minutes} minutos**. Motivo: ${reason}`);
 }
};