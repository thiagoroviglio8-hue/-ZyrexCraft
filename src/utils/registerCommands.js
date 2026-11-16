const { REST, Routes } = require("discord.js");

async function registerCommands(commands, config) {
  if (!config.token || !config.clientId) {
    throw new Error("Faltan DISCORD_TOKEN o CLIENT_ID en las variables de entorno.");
  }

  const body = commands.map(command => command.data.toJSON());
  const rest = new REST({ version: "10" }).setToken(config.token);
  const route = config.guildId
    ? Routes.applicationGuildCommands(config.clientId, config.guildId)
    : Routes.applicationCommands(config.clientId);

  await rest.put(route, { body });
  console.log(`✅ Discord registró ${body.length} comandos ${config.guildId ? "en el servidor de prueba" : "globalmente"}.`);
}

module.exports = registerCommands;
