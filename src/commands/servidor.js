const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
 data: new SlashCommandBuilder().setName("servidor").setDescription("Muestra la información del servidor Minecraft de CircuMC."),
 async execute(i) {
  const e = new EmbedBuilder()
   .setColor(0x1677FF)
   .setTitle("🌐 CIRCUMC | SERVIDOR MINECRAFT")
   .setDescription(`**IP:** ${config.minecraft.ip}\n**Puerto:** ${config.minecraft.port}\n**Versión:** ${config.minecraft.version}\n\n¡Te esperamos dentro de CircuMC!`)
   .setFooter({ text: "CircuMC • Información oficial" })
   .setTimestamp();
  await i.reply({ embeds: [e] });
 }
};