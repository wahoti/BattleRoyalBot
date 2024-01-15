https://discord.com/api/oauth2/authorize?client_id=1037462730812166155&permissions=2147551232&scope=bot%20applications.commands

mvp actions

- punch
- kick
- dodge: dodge all except one low mid high
- counter: counter one low mid high (todo)
- guard: reduce damage (todo)
- grapple: ?? (todo)

- hosting (DigitalOcean)
  https://devdojo.com/howtoubuntu/run-a-discordjs-bot-on-ubuntu
  https://www.npmjs.com/package/pm2
  https://pm2.keymetrics.io/docs/usage/cluster-mode/
- pm2 start app.js
- pm2 list
- pm2 delete

to add a new command

- add the command file in /commands/actions/newAction.js
- register the command in /game/CONST.js
- add options in /game/CONST.js
- add a handler to /game/Game.js

guard thoughts

grapple thoughts
