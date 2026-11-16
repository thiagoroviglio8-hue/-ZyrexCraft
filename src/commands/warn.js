const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../database/store");
module.exports = {
 data: new SlashCommandBuilder().setName("warn").setDescription("Registra una advertencia para un miembro.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(o => o.setName("usuario").setDescription("Miembro").setRequired(true))
  .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(true).setMaxLength(500)),
 async execute(i) {
  const user = i.options.getUser("usuario"), reason = i.options.getString("motivo");
  if (user.bot || user.id === i.user.id) return i.reply({ content: "No puedes advertir a ese usuario.", ephemeral: true });
  db.all().warnings[user.id] ||= [];
  db.all().warnings[user.id].push({ reason, moderator: i.user.id, at: Date.now(), guild: i.guildId });
  db.save();
  await i.reply(`⚠️ ${user} recibió una advertencia. Motivo: **${reason}**`);
 }
};