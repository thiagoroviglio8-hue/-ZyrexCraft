module.exports={name:"interactionCreate",async execute(i,client){
 if(i.isChatInputCommand()){const command=client.commands.get(i.commandName);if(!command)return;try{await command.execute(i,client);}catch(error){console.error(error);const payload={content:"Ocurrió un error al ejecutar este comando.",ephemeral:true};if(i.replied||i.deferred)await i.followUp(payload).catch(()=>{});else await i.reply(payload).catch(()=>{});}return;}
 if(i.isButton()&&(i.customId==="suggest_up"||i.customId==="suggest_down")){
  const db=require("../database/store"),entry=db.all().suggestions[i.message.id];if(!entry)return i.reply({content:"Esta sugerencia ya no está disponible.",ephemeral:true});
  const up=i.customId==="suggest_up",own=up?entry.up:entry.down,other=up?entry.down:entry.up;
  if(own.includes(i.user.id))return i.reply({content:"Ya votaste en esta opción.",ephemeral:true});
  entry.up=entry.up.filter(x=>x!==i.user.id);entry.down=entry.down.filter(x=>x!==i.user.id);own.push(i.user.id);db.save();
  const {ActionRowBuilder,ButtonBuilder,ButtonStyle}=require("discord.js");
  const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("suggest_up").setLabel(`👍 ${entry.up.length}`).setStyle(ButtonStyle.Success),new ButtonBuilder().setCustomId("suggest_down").setLabel(`👎 ${entry.down.length}`).setStyle(ButtonStyle.Danger));
  await i.update({components:[row]});
 }
}};
