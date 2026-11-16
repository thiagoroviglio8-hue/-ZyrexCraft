const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/store");
module.exports = {
 data: new SlashCommandBuilder().setName("saldo").setDescription("Consulta tus monedas o las de otro miembro.")
  .addUserOption(o => o.setName("usuario").setDescription("Miembro a consultar")),
 async execute(i) {
  const target = i.options.getUser("usuario") || i.user;
  const u = db.user(target.id);
  await i.reply({ embeds: [new EmbedBuilder().setColor(0x1677FF).setTitle("💰 Saldo").setDescription(`${target} tiene **${u.coins} monedas**.`)] });
 }
};