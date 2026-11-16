const { EmbedBuilder } = require("discord.js");
const BLUE = 0x1677FF;
function embed(title, description) { return new EmbedBuilder().setColor(BLUE).setTitle(title).setDescription(description).setTimestamp(); }
module.exports = { embed, BLUE };
