const { SlashCommandBuilder, EmbedBuilder }=require("discord.js");
const config=require("../config");
module.exports={data:new SlashCommandBuilder().setName("servidor").setDescription("Muestra la información de ZyrexCraft."),async execute(i){
 const e=new EmbedBuilder().setColor(0x1677FF).setTitle("🌐 ZYREXCRAFT NETWORK").setDescription(`**IP:** ${config.minecraft.ip}\n**Puerto:** ${config.minecraft.port}\n**Versión:** ${config.minecraft.version}\n\n¡Prepárate para jugar!`);
 await i.reply({embeds:[e]});
}};
