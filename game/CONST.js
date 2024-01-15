const GAME_TIC = "1000";
const POLL_TIC = "1000";

const GAME_STATUS = {
  CREATED: "CREATED",
  STARTED: "STARTED",
  ENDED: "ENDED",
};

const PLAYER_STATUS = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
};

const MAX_HP = 10;
const MAX_STAMINA = 1;
const LEG_DAMAGE_THRESHOLD = 5;
const LEG_DAMAGE_THRESHOLD_MAX = 10;

const ACTIONS = {
  punch: {
    name: "punch",
    cost: 10,
    damage: 2,
    props: {
      recovery: 5,
      staminaDamage: 4,
    },
  },
  kick: {
    name: "kick",
    cost: 20,
    damage: 4,
    props: {
      staminaDamage: 8,
      legDamage: 4,
    },
  },
};

const PUNCH_TYPES = {
  Jab: "Jab",
  Cross: "Cross",
  Body: "Body",
};

const KICK_TYPES = {
  Body: "Body",
  Head: "Head",
  Leg: "Leg",
};

const getExecute = (actionId) => async (interaction) => {
  const target = interaction.options.getUser("target");
  const position = interaction.options.getString("position");
  const { response, followUp } = global.engine.gameAction({
    guildId: interaction.guildId,
    playerId: interaction.user.id,
    targetId: target.id,
    actionId,
    position,
  });
  await interaction.reply(response);
  if (followUp) {
    const stamina =
      global.engine.games[interaction.guildId].players[interaction.user.id]
        .stamina;
    setTimeout(async () => {
      await interaction.followUp(followUp);
    }, Math.abs(stamina * 1000));
  }
};

const STATUS_EFFECTS = {
  legInjured: "leg injured",
  legSeverelyInjured: "leg severely injured",
};

module.exports = {
  GAME_STATUS,
  GAME_TIC,
  POLL_TIC,
  MAX_HP,
  MAX_STAMINA,
  ACTIONS,
  PLAYER_STATUS,
  PUNCH_TYPES,
  KICK_TYPES,
  getExecute,
  LEG_DAMAGE_THRESHOLD,
  LEG_DAMAGE_THRESHOLD_MAX,
  STATUS_EFFECTS,
};
