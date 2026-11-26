const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config");
const db = require("../database/store");

module.exports = {
 data: new SlashCommandBuilder().setName("sugerencia").setDescription("Envía una sugerencia para CircuMC.")
  .addStringOption(o => o.setName("texto").setDescription("Tu propuesta").setRequired(true).setMaxLength(1000)),
 async execute(i) {
  const text = i.options.getString("texto");
  const e = new EmbedBuilder().setColor(0x1677FF).setTitle("💡 Nueva sugerencia para CircuMC").setDescription(text).addFields({ name: "Autor", value: `${i.user}` }).setFooter({ text: "CircuMC • Sugerencias" }).setTimestamp();
  const row = new ActionRowBuilder().addComponents(
   new ButtonBuilder().setCustomId("suggest_up").setLabel("👍 0").setStyle(ButtonStyle.Success),
   new ButtonBuilder().setCustomId("suggest_down").setLabel("👎 0").setStyle(ButtonStyle.Danger)
  );
  const channel = config.channels.suggestions ? i.guild.channels.cache.get(config.channels.suggestions) : i.channel;
  if (!channel) return i.reply({ content: "No encuentro el canal de sugerencias. Configura SUGGESTIONS_CHANNEL_ID.", ephemeral: true });
  const msg = await channel.send({ embeds: [e], components: [row] });
  db.all().suggestions[msg.id] = { author: i.user.id, text, up: [], down: [] };
  db.save();
  await i.reply({ content: "✅ Tu sugerencia fue enviada al equipo de CircuMC.", ephemeral: true });
 }
};