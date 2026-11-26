const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/store");

module.exports = {
 data: new SlashCommandBuilder().setName("perfil").setDescription("Muestra tu perfil o el de otro miembro.").addUserOption(o => o.setName("usuario").setDescription("Miembro a consultar")),
 async execute(i) {
  const target = i.options.getUser("usuario") || i.user;
  const u = db.user(target.id);
  const card = new EmbedBuilder()
   .setColor(0x1677FF)
   .setTitle("Perfil de CircuMC")
   .setThumbnail(target.displayAvatarURL())
   .setDescription(`**Usuario:** ${target}\n**Nivel:** ${u.level}\n**XP:** ${u.xp}\n**Monedas:** ${u.coins}\n**Mensajes:** ${u.messages}`)
   .setFooter({ text: "CircuMC • Comunidad" });
  await i.reply({ embeds: [card] });
 }
};