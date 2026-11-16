# ZYREXCRAFT NETWORK — Discord Bot

Bot oficial comunitario de ZyrexCraft, desarrollado con JavaScript, Discord.js v14 y Node.js 24.

## Funciones
- Bienvenidas y despedidas configurables.
- XP, niveles, ranking, perfil, reputación y economía virtual.
- Sugerencias con votos y revisión del staff.
- Invitaciones y recompensas por metas (roles configurables).
- Sorteos con botones, duración, ganadores y reroll.
- Moderación: ban, kick, timeout, advertencias y limpieza.
- Tickets, postulaciones, anuncios y registros.
- Información y estado básico del servidor Minecraft.

## Instalación
1. Usa Node.js 24.
2. Ejecuta npm install.
3. Copia .env.example a .env y completa las variables.
4. Ejecuta npm run deploy para registrar los comandos.
5. Ejecuta npm start.

En Bot-Hosting, coloca el token y los IDs en las variables de entorno del panel. Nunca subas el archivo .env ni compartas tu token.

Si GUILD_ID está definido, los comandos se registran en ese servidor para pruebas. Si queda vacío, se registran globalmente.

## Persistencia
Los datos se guardan en data/database.json. Asegúrate de que el hosting conserve la carpeta data entre reinicios y reinstalaciones.

## Permisos e intents
Activa Server Members Intent y Message Content Intent en el Developer Portal. Invita el bot con los scopes bot y applications.commands, y concede los permisos que correspondan a sus funciones.
