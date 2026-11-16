const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const db = require("./database/store");
if (!config.token || !config.clientId) { console.error("Faltan DISCORD_TOKEN o CLIENT_ID."); process.exit(1); }
db.load();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildInvites], partials: [Partials.Channel, Partials.Message, Partials.GuildMember] });
client.commands = new Collection();
for (const file of fs.readdirSync(path.join(__dirname, "commands")).filter(f => f.endsWith(".js"))) {
  const command = require(path.join(__dirname, "commands", file));
  if (command.data && command.execute) client.commands.set(command.data.name, command);
}
for (const file of fs.readdirSync(path.join(__dirname, "events")).filter(f => f.endsWith(".js"))) {
  const event = require(path.join(__dirname, "events", file));
  client[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args, client));
}
client.on("messageCreate", message => {
  if (message.author.bot || !message.guild) return;
  const u = db.user(message.author.id); u.messages++; u.xp += Math.floor(Math.random() * 6) + 5;
  const next = 100 + u.level * 50;
  if (u.xp >= next) { u.xp -= next; u.level++; message.channel.send({ content: `✨ ¡${message.author} subió al nivel **${u.level}**!` }).catch(() => {}); }
  db.save();
});
async function applyInviteRewards(guild, userId, count) {
  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) return;
  for (const [amount, roleId] of [[30,config.roles.invite30],[20,config.roles.invite20],[10,config.roles.invite10],[5,config.roles.invite5]]) {
    if (!roleId) continue;
    const role = guild.roles.cache.get(roleId); if (!role) continue;
    if (count >= amount) await member.roles.add(role).catch(() => {}); else await member.roles.remove(role).catch(() => {});
  }
}
client.on("guildMemberAdd", async member => {
  try {
    const cached = client.inviteCache?.get(member.guild.id);
    const fresh = await member.guild.invites.fetch();
    const used = fresh.find(inv => cached?.has(inv.code) && inv.uses > cached.get(inv.code));
    if (used?.inviter) {
      const record = db.all().invites[used.inviter.id] ||= { total: 0, members: [] };
      if (!record.members.includes(member.id)) record.members.push(member.id);
      record.total = record.members.length; db.all().inviteUses[member.id] = used.inviter.id;
      await applyInviteRewards(member.guild, used.inviter.id, record.total); db.save();
    }
    client.inviteCache?.set(member.guild.id, new Map(fresh.map(i => [i.code, i.uses])));
  } catch {}
  const channel = member.guild.channels.cache.get(config.channels.welcome);
  if (channel) channel.send(`👋 ¡Bienvenido/a ${member} a **ZYREXCRAFT NETWORK**!`).catch(() => {});
});
client.on("guildMemberRemove", async member => {
  const inviter = db.all().inviteUses[member.id];
  if (inviter) {
    const record = db.all().invites[inviter];
    if (record) { record.members = record.members.filter(id => id !== member.id); record.total = record.members.length; await applyInviteRewards(member.guild, inviter, record.total); }
    delete db.all().inviteUses[member.id]; db.save();
  }
  const channel = member.guild.channels.cache.get(config.channels.goodbye);
  if (channel) channel.send(`👋 **${member.user.username}** salió de ZyrexCraft.`).catch(() => {});
});
client.once("ready", async readyClient => {
  console.log(`Conectado como ${readyClient.user.tag}`);
  client.inviteCache = new Map();
  for (const guild of client.guilds.cache.values()) {
    const invites = await guild.invites.fetch().catch(() => null);
    if (invites) client.inviteCache.set(guild.id, new Map(invites.map(i => [i.code, i.uses])));
  }
});
process.on("SIGINT", () => { db.save(); client.destroy(); process.exit(0); });
process.on("SIGTERM", () => { db.save(); client.destroy(); process.exit(0); });
client.login(config.token);
