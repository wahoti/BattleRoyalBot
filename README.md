GAME INFO

In BattleRoyalBot players participate in a free for all combat where players take damage to their health points until there is only one player left. Players perform actions through / commands. Each action has a stamina cost. Stamina refunds at 1 point a second so you can think of stamina cost as a cooldown before your next action.

/create: creates a game and auto joins it
/join: joins a game
/start: starts the game
/end: ends the game
/status: see status of current game
/test: create and start a test game with the bot

Each server has 1 game going at a time. If you create a new game it will override the existing one.

/punch
/kick
/grapple
/dodge
/counter
/guard

- punch: basic attack, 3 types
- - body (low): stamina damage
- - jab (mid): recover stamina
- - cross (high): critical hit chance 23% for double damage

- kick: higher cost higher damage basic attack, 3 types
- - leg (low): leg damage
- - body (mid): stamina damage
- - high (high): critical hit chance 23% for double damage

- grapple: basic attack that increments grapple status, 3 types
- - trip (low): recover stamina, 1 point of leg damage
- - takedown (mid): stamina damage
- - throw (high): health damage

- dodge: pick 1 of 3 positions to dodge (low, mid, high)
- - low is hit by mid
- - mid is hit by high
- - high is hit by low

- counter: pick 1 of 3 position to counter
- - evade and retaliate against an attack of chosen position

- guard: reduce incoming damage, 3 types
- - quick: recover stamina
- - recover: recover health
- - grapple: defend against grapples + grapple anyone who attacks you

stamina recovers at 1 point a second

stamina damage: causes extra stamina usage on the player's next action then is reset to 0.

grapple status: increments from level 1 to level 3

- level 1: -1 damage, +1 stamina fatigue
- level 2: -2 damage, +2 stamina fatigue
- level 3: 10 damage

leg damage: builds up and causes negative effects

- 5 damage: doubled stamina cost
- 10 damage: doubled stamina cost again

critical hits are 23% for double damage

NOTES

https://discord.com/api/oauth2/authorize?client_id=1037462730812166155&permissions=2147551232&scope=bot%20applications.commands

hosting (DigitalOcean)

- https://devdojo.com/howtoubuntu/run-a-discordjs-bot-on-ubuntu
- https://www.npmjs.com/package/pm2
- https://pm2.keymetrics.io/docs/usage/cluster-mode/
- pm2 start app.js
- pm2 list
- pm2 delete

to add a new command

- add the command file in /commands/actions/newAction.js
- register the command in /game/CONST.js
- add options in /game/CONST.js
- add a handler to /game/Game.js
