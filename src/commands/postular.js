const { SlashCommandBuilder } = require("discord.js");
const config = require("../config");
module.exports = {
 data: new SlashCommandBuilder().setName("postular").setDescription("Envía tu postulación para formar parte del equipo.")
  .addStringOption(o => o.setName("puesto").setDescription("Puesto al que quieres postularte").setRequired(true).setMaxLength(80))
  .addStringOption(o => o.setName("experiencia").setDescription("Tu experiencia").setRequired(true).setMaxLength(1000))
  .addStringOption(o => o.setName("motivo").setDescription("Por qué quieres entrar al equipo").setRequired(true).setMaxLength(1000)),
 async execute(i) {
  const channel = config.channels.applications ? i.guild.channels.cache.get(config.channels.applications) : null;
  if (!channel) return i.reply({ content: "No está configurado APPLICATIONS_CHANNEL_ID o no encuentro ese canal.", ephemeral: true });
  const puesto = i.options.getString("puesto"), experiencia = i.options.getString("experiencia"), motivo = i.options.getString("motivo");
  await channel.send({ content: "📨 **Nueva postulación**", embeds: [{
   color: 0x1677FF, title: `Postulación de ${i.user.tag}`,
   description: `**Usuario:** ${i.user}\n**Puesto:** ${puesto}\n**Experiencia:** ${experiencia}\n**Motivo:** ${motivo}`
  }] });
  await i.reply({ content: "✅ Tu postulación fue enviada al equipo. ¡Gracias por participar!", ephemeral: true });
 }
};