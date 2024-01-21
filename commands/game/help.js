const { SlashCommandBuilder } = require("discord.js");

const HELP_TYPES = {
  General: "General",
  Mechanics: "Mechanics",
  GameSetup: "GameSetup",
  GameActions: "GameActions",
};

const HELP_MAP = {
  [HELP_TYPES.General]:
    "In BattleRoyalBot players participate in a free for all combat where players take damage to their health points until there is only one player left. Players perform actions through / commands. Each action has a stamina cost. After using an ability players will have to wait for their stamina to recharge before peforming another action. Stamina regenerates over time so you can think of stamina cost as a cooldown before your next action. The bot sends you a message when your stamina recovers and you can act again.\nTry '/help type' for more help.",
  [HELP_TYPES.Mechanics]: `
  - MECHANICS
  - stamina damage: causes extra stamina usage on the player's next action then is reset to 0.
  - rage: increases next instance of damage by rage level then is reset to 0
  - weak: decreases next instance of damage by weak level then is reset to 0
  - grapple status: grappling an opponent builds up their grapple level from 1 to 3.
  - - level 1: -1 damage, +2 stamina fatigue
  - - level 2: -2 damage, +4 stamina fatigue
  - - level 3: 10 damage
  - leg damage: attacks with leg damage build up a meter with negative effects at certain thresholds.
  - - 5 damage: 150% stamina cost
  - - 10 damage: 200% stamina cost
  - critical hits: attacks that can crit have a 23% chance for double damage.
  - - cross punch
  - - head kick
  - - counters`,
  [HELP_TYPES.GameSetup]: `
  - GAME COMMANDS
  - /game-create: creates a game and auto joins it
  - /game-join: joins a game
  - /game-start: starts the game
  - /game-end: ends the game
  - /game-status: see status of current game
  - /game-add-bot: adds a bot
  - /game-quick: creates and starts a game with 1 bot
  - /test-game: create and starts a game with 2 bots
  
  - game speed:
  - Fast game speed: stamina regenerates at 1 point per second
  - Medium game speed: stamina regenerates at 1 point per 2 seconds
  - Slow game speed: stamina regenerates at 1 point per 3 seconds
  `,
  [HELP_TYPES.GameActions]: `
  - GAME ACTION COMMANDS
  - /act-punch: 👊 basic attack, cost 10, 2 damage
  - - body (low): stamina damage
  - - jab (mid): refund 5 stamina (shorter cooldown)
  - - cross (high): critical hit chance 23% for double damage
  - /act-kick: 🦵 basic attack, cost 20, 4 damage
  - - leg (low): leg damage
  - - body (mid): stamina damage
  - - high (high): critical hit chance 23% for double damage
  - /act-grapple: 🫳 basic attack, cost 15, inflicts grapple status
  - - trip (low): refund 5 stamina (shorter cooldown)
  - - takedown (mid): stamina damage
  - - throw (high): health damage
  - /act-dodge: 🏃 dodge 2/3 incoming attack positions, cost 10, duration 10
  - - low is hit by mid
  - - mid is hit by high
  - - high is hit by low
  - - dodge is a hidden move (other players cant see you use this)
  - /act-counter: ↪️ pick 1 of 3 positions to counter, cost 5, duration 15
  - - evade and retaliate against an attack of chosen position
  - - counter is a hidden move (other players cant see you use this)
  - /act-guard: 🛡️ reduce incoming damage by 50%, cost 8, duration 15
  - - quick: refund 4 stamina (shorter cooldown)
  - - recover: recover health
  - - grapple: reduce your grapple level by one, defend against incoming grapples
  - /act-taunt: utility effects, double effectiveness when half health, cost 8
  - - distract 🥶: apply weak to all opponents
  - - rage 🤬: apply rage to self
  - - throw 💥: 1 damage to all opponents`,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-help")
    .setDescription("game help")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("help type")
        .setRequired(true)
        .addChoices(
          { name: HELP_TYPES.General, value: HELP_TYPES.General },
          { name: HELP_TYPES.Mechanics, value: HELP_TYPES.Mechanics },
          { name: HELP_TYPES.GameSetup, value: HELP_TYPES.GameSetup },
          { name: HELP_TYPES.GameActions, value: HELP_TYPES.GameActions }
        )
    ),
  async execute(interaction) {
    const helpType = interaction.options.getString("type");
    const helpText = helpType
      ? HELP_MAP[helpType]
      : HELP_MAP[HELP_TYPES.General];
    await interaction.reply({ content: helpText, ephemeral: true });
    // await interaction.followUp(followUp);
  },
};
