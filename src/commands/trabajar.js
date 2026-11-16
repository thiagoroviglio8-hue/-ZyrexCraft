const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/store");
module.exports = {
 data: new SlashCommandBuilder().setName("trabajar").setDescription("Realiza un trabajo y gana monedas."),
 async execute(i) {
  const u = db.user(i.user.id), now = Date.now(), cooldown = 60 * 60 * 1000;
  if (now - (u.lastWork || 0) < cooldown) return i.reply({ content: "Ya trabajaste recientemente. Inténtalo más tarde.", ephemeral: true });
  const earned = Math.floor(Math.random() * 101) + 50;
  u.lastWork = now; u.coins += earned; db.save();
  await i.reply(`🛠️ Trabajaste y ganaste **${earned} monedas**. Tu saldo es **${u.coins}**.`);
 }
};