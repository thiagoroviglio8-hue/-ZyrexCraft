const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("../database/store");
module.exports = {
 data: new SlashCommandBuilder().setName("warnings").setDescription("Consulta las advertencias de un miembro.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(o => o.setName("usuario").setDescription("Miembro").setRequired(true)),
 async execute(i) {
  const user = i.options.getUser("usuario"), rows = (db.all().warnings[user.id] || []).filter(w => w.guild === i.guildId);
  const desc = rows.length ? rows.map((w,n) => `**${n+1}.** ${w.reason} — <@!${w.moderator}>`).join("\n") : "Este miembro no tiene advertencias registradas.";
  await i.reply({ embeds: [new EmbedBuilder().setColor(0x1677FF).setTitle(`Advertencias de ${user.tag}`).setDescription(desc)], ephemeral: true });
 }
};