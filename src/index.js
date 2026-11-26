const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const db = require("./database/store");
const registerCommands = require("./utils/registerCommands");

if (!config.token || !config.clientId) {
  console.error("❌ Faltan DISCORD_TOKEN o CLIENT_ID en las variables de entorno.");
  process.exit(1);
}

db.load();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildInvites
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter(name => name.endsWith(".js"))) {
  const command = require(path.join(commandsPath, file));
  if (command.data && typeof command.execute === "function") {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️ Se omitió ${file}: falta data o execute.`);
  }
}

for (const file of fs.readdirSync(path.join(__dirname, "events")).filter(name => name.endsWith(".js"))) {
  const event = require(path.join(__dirname, "events", file));
  client[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args, client));
}

client.on("messageCreate", message => {
  if (message.author.bot || !message.guild) return;
  const user = db.user(message.author.id);
  user.messages++;
  user.xp += Math.floor(Math.random() * 6) + 5;
  const requiredXp = 100 + user.level * 50;
  if (user.xp >= requiredXp) {
    user.xp -= requiredXp;
    user.level++;
    message.channel.send({ content: `✨ ¡${message.author} subió al nivel **${user.level}**!` }).catch(() => {});
  }
  db.save();
});

async function applyInviteRewards(guild, userId, count) {
  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) return;
  for (const [amount, roleId] of [[30, config.roles.invite30], [20, config.roles.invite20], [10, config.roles.invite10], [5, config.roles.invite5]]) {
    if (!roleId) continue;
    const role = guild.roles.cache.get(roleId);
    if (!role) continue;
    if (count >= amount) await member.roles.add(role).catch(() => {});
    else await member.roles.remove(role).catch(() => {});
  }
}

client.on("guildMemberAdd", async member => {
  try {
    const cached = client.inviteCache?.get(member.guild.id);
    const fresh = await member.guild.invites.fetch();
    const used = fresh.find(invite => cached?.has(invite.code) && invite.uses > cached.get(invite.code));
    if (used?.inviter) {
      const record = db.all().invites[used.inviter.id] ||= { total: 0, members: [] };
      if (!record.members.includes(member.id)) record.members.push(member.id);
      record.total = record.members.length;
      db.all().inviteUses[member.id] = used.inviter.id;
      await applyInviteRewards(member.guild, used.inviter.id, record.total);
      db.save();
    }
    client.inviteCache?.set(member.guild.id, new Map(fresh.map(invite => [invite.code, invite.uses])));
  } catch (error) {
    console.warn("No se pudo identificar la invitación usada:", error.message);
  }

  const channel = config.channels.welcome ? member.guild.channels.cache.get(config.channels.welcome) : null;
  if (channel) channel.send(`👋 ¡Bienvenido/a ${member} a **CircuMC**!`).catch(() => {});
});

client.on("guildMemberRemove", async member => {
  const inviter = db.all().inviteUses[member.id];
  if (inviter) {
    const record = db.all().invites[inviter];
    if (record) {
      record.members = record.members.filter(id => id !== member.id);
      record.total = record.members.length;
      await applyInviteRewards(member.guild, inviter, record.total);
    }
    delete db.all().inviteUses[member.id];
    db.save();
  }
  const channel = config.channels.goodbye ? member.guild.channels.cache.get(config.channels.goodbye) : null;
  if (channel) channel.send(`👋 **${member.user.username}** salió de CircuMC.`).catch(() => {});
});

client.once("ready", async readyClient => {
  console.log(`✅ Conectado como ${readyClient.user.tag}`);
  client.inviteCache = new Map();
  for (const guild of client.guilds.cache.values()) {
    const invites = await guild.invites.fetch().catch(() => null);
    if (invites) client.inviteCache.set(guild.id, new Map(invites.map(invite => [invite.code, invite.uses])));
  }
});

async function start() {
  try {
    console.log(`🔄 Registrando automáticamente ${client.commands.size} comandos...`);
    await registerCommands([...client.commands.values()], config);
    await client.login(config.token);
  } catch (error) {
    console.error("❌ No se pudo iniciar el bot:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => { db.save(); client.destroy(); process.exit(0); });
process.on("SIGTERM", () => { db.save(); client.destroy(); process.exit(0); });

start();
