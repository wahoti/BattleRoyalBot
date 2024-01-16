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
      dodgeable: true,
      counterable: true,
    },
  },
  kick: {
    name: "kick",
    cost: 20,
    damage: 4,
    props: {
      staminaDamage: 8,
      legDamage: 4,
      dodgeable: true,
      counterable: true,
    },
  },
  dodge: {
    name: "dodge",
    cost: 25,
    props: {
      duration: 25,
    },
  },
  counter: {
    name: "counter",
    cost: 15,
    props: {
      duration: 15,
    },
  },
};

const PUNCH_TYPES = {
  Jab: "Jab", // Mid
  Cross: "Cross", // High
  Body: "Body", // Low
};

const KICK_TYPES = {
  Body: "Body", // Mid
  Head: "Head", // High
  Leg: "Leg", // Low
};

const GRAPPLE_TYPES = {
  Trip: "Trip", // Low
  Takedown: "Takedown", // Mid
  Throw: "Throw", // High
};

const DODGE_TYPES = {
  Low: "Low",
  Mid: "Mid",
  High: "High",
};

const COUNTER_DAMAGE = 5;

const POSITION_MAP = {
  [GRAPPLE_TYPES.Trip]: DODGE_TYPES.Low,
  [GRAPPLE_TYPES.Takedown]: DODGE_TYPES.Mid,
  [GRAPPLE_TYPES.Throw]: DODGE_TYPES.High,

  [KICK_TYPES.Leg]: DODGE_TYPES.Low,
  [KICK_TYPES.Body]: DODGE_TYPES.Mid,
  [KICK_TYPES.Head]: DODGE_TYPES.High,

  [PUNCH_TYPES.Body]: DODGE_TYPES.Low,
  [PUNCH_TYPES.Jab]: DODGE_TYPES.Mid,
  [PUNCH_TYPES.High]: DODGE_TYPES.High,
};

// low hit by mid
// mid hit by high
// high hit by low
const DODGE_MAP = {
  [DODGE_TYPES.Low]: DODGE_TYPES.Mid,
  [DODGE_TYPES.Mid]: DODGE_TYPES.High,
  [DODGE_TYPES.High]: DODGE_TYPES.Low,
};

const getExecute = ({ actionId, useTarget = false }) => async (interaction) => {
  const target = useTarget ? interaction.options.getUser("target") : "";
  const position = interaction.options.getString("position");
  const { response, followUp } = global.engine.gameAction({
    guildId: interaction.guildId,
    playerId: interaction.user.id,
    targetId: target?.id,
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
  GRAPPLE_TYPES,
  DODGE_TYPES,
  POSITION_MAP,
  DODGE_MAP,
  COUNTER_DAMAGE,
};
