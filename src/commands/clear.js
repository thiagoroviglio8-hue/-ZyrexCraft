const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("clear").setDescription("Elimina mensajes recientes del canal.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad de mensajes (1 a 100)").setMinValue(1).setMaxValue(100).setRequired(true)),
 async execute(i) {
  const amount = i.options.getInteger("cantidad");
  const deleted = await i.channel.bulkDelete(amount, true);
  await i.reply({ content: `🧹 Se eliminaron ${deleted.size} mensajes. Los mensajes de más de 14 días no se pueden borrar con esta función.`, ephemeral: true });
 }
};