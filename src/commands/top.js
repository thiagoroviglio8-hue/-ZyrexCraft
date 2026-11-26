const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/store");

module.exports = {
 data: new SlashCommandBuilder().setName("top").setDescription("Muestra el ranking de niveles de CircuMC."),
 async execute(i) {
  const rows = Object.entries(db.all().users).sort((a, b) => b[1].level - a[1].level || b[1].xp - a[1].xp).slice(0, 10);
  const desc = rows.length ? rows.map(([id, u], n) => `**${n + 1}.** <@${id}> — nivel ${u.level} (${u.xp} XP)`).join("\n") : "Todavía no hay puntuaciones.";
  await i.reply({ embeds: [new EmbedBuilder().setColor(0x1677FF).setTitle("🏆 Ranking CircuMC").setDescription(desc).setFooter({ text: "CircuMC • Ranking de la comunidad" })] });
 }
};