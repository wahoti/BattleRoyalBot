GAME INFO

In BattleRoyalBot players participate in a free for all combat where players take damage to their health points until there is only one player left. Players perform actions through / commands. Each action has a stamina cost. After using an ability players will have to wait for their stamina to recharge before peforming another action. Stamina regenerates over time so you can think of stamina cost as a cooldown before your next action. The bot sends you a message when your stamina recovers and you can act again.

- Each server has 1 game going at a time. If you create a new game it will override the existing one.

COMMANDS

- /game-create: creates a game and auto joins it
- /game-join: joins a game
- /game-start: starts the game
- /game-end: ends the game
- /game-status: see status of current game
- /game-add-bot: adds a bot
- /game-quick: creates and starts a game with 1 bot
- /test-game: create and starts a game with 2 bots

- /act-punch: basic attack, cost 10, 2 damage
- - body (low): stamina damage
- - jab (mid): refund stamina (shorter cooldown)
- - cross (high): critical hit chance 23% for double damage

- /act-kick: basic attack, cost 20, 4 damage
- - leg (low): leg damage
- - body (mid): stamina damage
- - high (high): critical hit chance 23% for double damage

- /act-grapple: basic attack, cost 15, inflicts grapple status
- - trip (low): refund stamina (shorter cooldown)
- - takedown (mid): stamina damage
- - throw (high): health damage

- /act-dodge: dodge 2/3 incoming attack positions
- - low is hit by mid
- - mid is hit by high
- - high is hit by low
- - dodge is a hidden move (other players cant see you use this)

- /act-counter: pick 1 of 3 positions to counter
- - evade and retaliate against an attack of chosen position
- - counter is a hidden move (other players cant see you use this)

- /act-guard: reduce incoming damage
- - quick: refund stamina (shorter cooldown)
- - recover: recover health
- - grapple: reduce your grapple level by one, defend against incoming grapples

- /act-taunt: utility effects, double effectiveness when half health
- - distract: apply weak to all opponents
- - rage: apply rage to self
- - throw: 1 damage to all opponents

MECHANICS

stamina damage: causes extra stamina usage on the player's next action then is reset to 0.

grapple status: grappling an opponent builds up their grapple level from 1 to 3.

- level 1: -1 damage, +2 stamina fatigue
- level 2: -2 damage, +4 stamina fatigue
- level 3: 10 damage

leg damage: attacks with leg damage build up a meter with negative effects at certain thresholds.

- 5 damage: 150% stamina cost
- 10 damage: 200% stamina cost

critical hits: attacks that can crit have a 23% chance for double damage.

- attacks that can crit:
- - cross punch
- - head kick
- - counters

game speed:

- Fast game speed: stamina regenerates at 1 point per second
- Medium game speed: stamina regenerates at 1 point per 2 seconds
- Slow game speed: stamina regenerates at 1 point per 3 seconds

rage: increases next instance of damage by rage level then is reset to 0
weak: decreases next instance of damage by weak level then is reset to 0

ACTION DETAILS

```
const MAX_HP = 10;
const MAX_STAMINA = 1;
const LEG_DAMAGE_THRESHOLD = 5;
const LEG_DAMAGE_THRESHOLD_MAX = 8;
const COUNTER_DAMAGE = 5;
const GRAPPLE_DAMAGE = 10;
const GRAPPLE_LIMIT = 3;

const ACTIONS = {
  punch: {
    name: "Punch",
    cost: 10,
    damage: 2,
    props: {
      staminaRecovery: 5,
      staminaDamage: 5,
      dodgeable: true,
      counterable: true,
    },
  },
  kick: {
    name: "Kick",
    cost: 20,
    damage: 4,
    props: {
      staminaDamage: 10,
      legDamage: 4,
      dodgeable: true,
      counterable: true,
    },
  },
  grapple: {
    name: "Grapple",
    cost: 15,
    damage: 0,
    props: {
      staminaDamage: 10,
      staminaRecovery: 5,
      throwDamage: 3,
      legDamage: 1,
      dodgeable: true,
      counterable: true,
    },
  },
  dodge: {
    name: "Dodge",
    cost: 10,
    props: {
      duration: 10,
    },
  },
  counter: {
    name: "Counter",
    cost: 5,
    props: {
      duration: 15,
    },
  },
  guard: {
    name: "Guard",
    cost: 8,
    props: {
      duration: 15,
      staminaRecovery: 4,
      healthRecovery: 2,
    },
  },
  taunt: {
    name: "Taunt",
    cost: 8,
    props: {
      throwDamage: 1,
    },
  },
};
```

DEVELOPMENT NOTES

bot invite link: https://discord.com/api/oauth2/authorize?client_id=1037462730812166155&permissions=2147551232&scope=bot%20applications.commands

hosting (DigitalOcean)

- https://devdojo.com/howtoubuntu/run-a-discordjs-bot-on-ubuntu
- https://www.npmjs.com/package/pm2
- https://pm2.keymetrics.io/docs/usage/cluster-mode/
- pm2 start index.js
- pm2 stop 0
- pm2 list

to add a new command

- add the command file in /commands/actions/newAction.js
- register the command in ACTIONS in /game/CONST.js
- add options in /game/CONST.js
- add a handler to /game/Game.js

to clear stale commands

- uncomment RESET_COMMANDS
- run deploy_commands.js

depends on config.json

```
{
  "token": "your token",
  "clientId": "your client id",
}
```
