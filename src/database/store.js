const fs = require("node:fs");
const path = require("node:path");
const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "database.json");
const defaults = { users: {}, invites: {}, inviteUses: {}, giveaways: {}, tickets: {}, warnings: {}, reputation: {}, suggestions: {}, settings: {} };
let data = structuredClone(defaults);
function load() {
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(file)) {
    try { data = { ...structuredClone(defaults), ...JSON.parse(fs.readFileSync(file, "utf8")) }; }
    catch (error) { console.error("No se pudo leer database.json:", error); }
  } else save();
}
function save() {
  fs.mkdirSync(dir, { recursive: true });
  const temp = file + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
}
function user(id) {
  if (!data.users[id]) data.users[id] = { xp: 0, level: 0, coins: 0, messages: 0, lastDaily: 0 };
  return data.users[id];
}
module.exports = { load, save, user, all: () => data };
