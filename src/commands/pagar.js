const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/store");
module.exports = {
 data: new SlashCommandBuilder().setName("pagar").setDescription("Envía monedas a otro miembro.")
  .addUserOption(o => o.setName("usuario").setDescription("Quién recibirá las monedas").setRequired(true))
  .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad a enviar").setMinValue(1).setRequired(true)),
 async execute(i) {
  const target = i.options.getUser("usuario"), amount = i.options.getInteger("cantidad");
  if (target.bot || target.id === i.user.id) return i.reply({ content: "No puedes transferir monedas a ese usuario.", ephemeral: true });
  const sender = db.user(i.user.id);
  if (sender.coins < amount) return i.reply({ content: "No tienes suficientes monedas.", ephemeral: true });
  sender.coins -= amount; db.user(target.id).coins += amount; db.save();
  await i.reply(`💸 ${i.user} envió **${amount} monedas** a ${target}.`);
 }
};