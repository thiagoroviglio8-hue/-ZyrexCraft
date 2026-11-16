const { SlashCommandBuilder } = require("discord.js");
const db=require("../database/store");
module.exports={data:new SlashCommandBuilder().setName("diario").setDescription("Reclama tus monedas diarias."),async execute(i){
 const u=db.user(i.user.id), now=Date.now(), day=86400000;
 if(now-u.lastDaily<day){const left=day-(now-u.lastDaily);return i.reply({content:`Ya reclamaste hoy. Vuelve en ${Math.ceil(left/3600000)} hora(s).`,ephemeral:true});}
 u.lastDaily=now;u.coins+=100;db.save();await i.reply(`🎁 Recibiste **100 monedas**. Ahora tienes **${u.coins}**.`);
}};
