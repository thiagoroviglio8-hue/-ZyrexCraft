require("dotenv").config();
module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  channels: {
    welcome: process.env.WELCOME_CHANNEL_ID, goodbye: process.env.GOODBYE_CHANNEL_ID,
    logs: process.env.LOG_CHANNEL_ID, suggestions: process.env.SUGGESTIONS_CHANNEL_ID,
    ticketCategory: process.env.TICKETS_CATEGORY_ID, ticketLogs: process.env.TICKET_LOG_CHANNEL_ID,
    applications: process.env.APPLICATIONS_CHANNEL_ID, announcements: process.env.ANNOUNCEMENTS_CHANNEL_ID
  },
  roles: {
    staff: process.env.STAFF_ROLE_ID, invite5: process.env.INVITE_REWARD_5_ROLE_ID,
    invite10: process.env.INVITE_REWARD_10_ROLE_ID, invite20: process.env.INVITE_REWARD_20_ROLE_ID,
    invite30: process.env.INVITE_REWARD_30_ROLE_ID
  },
  minecraft: {
    ip: process.env.MINECRAFT_IP || "Configura la IP",
    port: process.env.MINECRAFT_PORT || "25565",
    version: process.env.MINECRAFT_VERSION || "1.21.4"
  }
};
