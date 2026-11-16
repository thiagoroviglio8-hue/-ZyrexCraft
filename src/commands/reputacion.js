const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/store");
module.exports = {
 data: new SlashCommandBuilder().setName("reputacion").setDescription("Da reputación o consulta la de un miembro.")
  .addSubcommand(s => s.setName("dar").setDescription("Da un punto de reputación").addUserOption(o => o.setName("usuario").setDescription("Miembro").setRequired(true)))
  .addSubcommand(s => s.setName("ver").setDescription("Consulta la reputación").addUserOption(o => o.setName("usuario").setDescription("Miembro"))),
 async execute(i) {
  const action = i.options.getSubcommand(), target = i.options.getUser("usuario") || i.user;
  db.all().reputation[target.id] ||= { score: 0, givenBy: [] };
  const record = db.all().reputation[target.id];
  if (action === "dar") {
   if (target.bot || target.id === i.user.id) return i.reply({ content: "No puedes darte reputación a ti mismo ni a un bot.", ephemeral: true });
   if (record.givenBy.includes(i.user.id)) return i.reply({ content: "Ya le diste reputación a esta persona.", ephemeral: true });
   record.givenBy.push(i.user.id); record.score++; db.save();
   return i.reply(`⭐ Le diste reputación a ${target}. Ahora tiene **${record.score}** puntos.`);
  }
  await i.reply(`⭐ ${target} tiene **${record.score}** puntos de reputación.`);
 }
};