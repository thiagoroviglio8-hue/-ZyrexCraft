const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("ticket").setDescription("Publica el panel para abrir tickets.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
 async execute(i) {
  const embed = new EmbedBuilder().setColor(0x1677FF).setTitle("🎫 Soporte de ZyrexCraft").setDescription("Pulsa el botón para abrir un ticket privado. Un miembro del equipo te atenderá cuando esté disponible.");
  const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ticket:open").setLabel("Abrir ticket").setEmoji("🎫").setStyle(ButtonStyle.Primary));
  await i.channel.send({ embeds: [embed], components: [row] });
  await i.reply({ content: "✅ Panel de tickets publicado.", ephemeral: true });
 }
};