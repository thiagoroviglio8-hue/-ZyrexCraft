# ZYREXCRAFT NETWORK — Discord Bot

Bot oficial comunitario de ZyrexCraft, desarrollado con JavaScript, Discord.js v14 y Node.js 24.

## Comandos incluidos
- `/ping`, `/perfil`, `/diario`, `/top`, `/saldo`, `/pagar`, `/trabajar`.
- `/reputacion dar|ver`.
- `/invites` y recompensas por metas de invitaciones.
- `/sugerencia` con botones para votar.
- `/ban`, `/kick`, `/timeout`, `/warn`, `/warnings`, `/clear`.
- `/ticket` para publicar el panel; botones para abrir y cerrar tickets privados.
- `/postular` para enviar solicitudes al canal del equipo.
- `/anuncio` para publicar comunicados.
- `/sorteo crear|terminar|reroll`, con botón para participar.
- `/servidor` para consultar la información configurada de Minecraft.

El bot también incluye bienvenidas, despedidas y XP por mensajes. Los comandos de moderación y administración requieren los permisos adecuados de Discord.

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
