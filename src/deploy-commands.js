require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const commands = [];
for (const file of fs.readdirSync(path.join(__dirname, "commands")).filter(f => f.endsWith(".js"))) {
  const command = require(path.join(__dirname, "commands", file));
  if (command.data) commands.push(command.data.toJSON());
}
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) throw new Error("Configura DISCORD_TOKEN y CLIENT_ID.");
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  const route = process.env.GUILD_ID ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID) : Routes.applicationCommands(process.env.CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log(`Registrados ${commands.length} comandos.`);
})().catch(console.error);
