const { SlashCommandBuilder }=require("discord.js");
const db=require("../database/store");
module.exports={data:new SlashCommandBuilder().setName("invites").setDescription("Consulta tus invitaciones registradas.").addUserOption(o=>o.setName("usuario").setDescription("Miembro a consultar")),async execute(i){
 const u=i.options.getUser("usuario")||i.user, record=db.all().invites[u.id];
 await i.reply(`📨 **${u.username}** tiene **${record?.total||0}** invitaciones registradas.`);
}};
