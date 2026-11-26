const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
 data: new SlashCommandBuilder().setName("ticket").setDescription("Publica el panel de soporte de CircuMC.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
 async execute(i) {
  const embed = new EmbedBuilder().setColor(0x1677FF).setTitle("🎫 Soporte de CircuMC").setDescription("¿Necesitas ayuda? Pulsa el botón para abrir un ticket privado. El equipo de CircuMC te atenderá cuando esté disponible.").setFooter({ text: "CircuMC • Centro de soporte" });
  const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ticket:open").setLabel("Abrir ticket").setEmoji("🎫").setStyle(ButtonStyle.Primary));
  await i.channel.send({ embeds: [embed], components: [row] });
  await i.reply({ content: "✅ Panel de soporte publicado.", ephemeral: true });
 }
};