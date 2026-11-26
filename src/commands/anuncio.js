const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
 data: new SlashCommandBuilder().setName("anuncio").setDescription("Publica un anuncio oficial de CircuMC.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption(o => o.setName("mensaje").setDescription("Contenido del anuncio").setRequired(true).setMaxLength(4000)),
 async execute(i) {
  const channel = config.channels.announcements ? i.guild.channels.cache.get(config.channels.announcements) : i.channel;
  if (!channel || !channel.isTextBased()) return i.reply({ content: "No encuentro el canal configurado en ANNOUNCEMENTS_CHANNEL_ID.", ephemeral: true });
  const embed = new EmbedBuilder().setColor(0x1677FF).setTitle("📢 CIRCUMC | ANUNCIO OFICIAL").setDescription(i.options.getString("mensaje")).setFooter({ text: `CircuMC • Publicado por ${i.user.tag}` }).setTimestamp();
  await channel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  await i.reply({ content: `✅ Anuncio publicado en ${channel}.`, ephemeral: true });
 }
};