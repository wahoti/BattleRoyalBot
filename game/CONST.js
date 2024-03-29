const GAME_STATUS = {
  CREATED: "CREATED",
  STARTED: "STARTED",
  ENDED: "ENDED",
};

const MAX_HP = 10;
const MAX_STAMINA = 1;
const LEG_DAMAGE_THRESHOLD = 5;
const LEG_DAMAGE_THRESHOLD_MAX = 8;
const COUNTER_DAMAGE = 5;
const GRAPPLE_DAMAGE = 10;
const GRAPPLE_LIMIT = 3;

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

const GUARD_TYPES = {
  Quick: "Quick",
  Recover: "Recover",
  Grapple: "Grapple",
};

const SPEED_TYPES = {
  Slow: "Slow",
  Medium: "Medium",
  Fast: "Fast",
};

const TAUNT_TYPES = {
  Distract: "Distract",
  Rage: "Rage",
  Throw: "Throw",
};

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
      useTarget: true,
    },
    args: PUNCH_TYPES,
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
      useTarget: true,
    },
    args: KICK_TYPES,
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
      useTarget: true,
    },
    args: GRAPPLE_TYPES,
  },
  dodge: {
    name: "Dodge",
    cost: 10,
    props: {
      duration: 10,
    },
    args: DODGE_TYPES,
  },
  counter: {
    name: "Counter",
    cost: 5,
    props: {
      duration: 15,
    },
    args: DODGE_TYPES,
  },
  guard: {
    name: "Guard",
    cost: 8,
    props: {
      duration: 15,
      staminaRecovery: 4,
      healthRecovery: 2,
    },
    args: GUARD_TYPES,
  },
  taunt: {
    name: "Taunt",
    cost: 8,
    props: {
      throwDamage: 1,
    },
    args: TAUNT_TYPES,
  },
};

const SPEED_MAP = {
  [SPEED_TYPES.Slow]: 3000,
  [SPEED_TYPES.Medium]: 2000,
  [SPEED_TYPES.Fast]: 1000,
};

const POSITION_MAP = {
  [GRAPPLE_TYPES.Trip]: DODGE_TYPES.Low,
  [GRAPPLE_TYPES.Takedown]: DODGE_TYPES.Mid,
  [GRAPPLE_TYPES.Throw]: DODGE_TYPES.High,

  [KICK_TYPES.Leg]: DODGE_TYPES.Low,
  [KICK_TYPES.Body]: DODGE_TYPES.Mid,
  [KICK_TYPES.Head]: DODGE_TYPES.High,

  [PUNCH_TYPES.Body]: DODGE_TYPES.Low,
  [PUNCH_TYPES.Jab]: DODGE_TYPES.Mid,
  [PUNCH_TYPES.Cross]: DODGE_TYPES.Cross,
};

// low hit by mid
// mid hit by high
// high hit by low
const DODGE_MAP = {
  [DODGE_TYPES.Low]: DODGE_TYPES.Mid,
  [DODGE_TYPES.Mid]: DODGE_TYPES.High,
  [DODGE_TYPES.High]: DODGE_TYPES.Low,
};

const recurredExecute = async (interaction) => {
  const { response, followUp, gameSpeedModifier } = global.engine.games[
    interaction.guildId
  ].players[interaction.user.id].preload();

  global.engine.games[interaction.guildId].players[
    interaction.user.id
  ].preload = null;

  await interaction.followUp(response);
  if (followUp) {
    const stamina =
      global.engine.games[interaction.guildId].players[interaction.user.id]
        .stamina;
    setTimeout(async () => {
      if (
        global.engine.games[interaction.guildId].status !== GAME_STATUS.started
      )
        return;
      if (
        global.engine.games[interaction.guildId].players[interaction.user.id]
          .preload
      ) {
        // console.log("CHAINED PRELOAD");
        // chained preload
        setTimeout(async () => {
          await recurredExecute(interaction);
        }, 1000);
      } else {
        // regular stamina message
        await interaction.followUp(followUp);
      }
    }, Math.abs(stamina * gameSpeedModifier));
  }
};

const getExecute = ({ actionId, useTarget = false }) => async (interaction) => {
  const target = useTarget ? interaction.options.getUser("target") : "";
  const position = interaction.options.getString("position");
  const { response, followUp, gameSpeedModifier } = global.engine.gameAction({
    guildId: interaction.guildId,
    playerId: interaction.user.id,
    targetId: target?.id,
    actionId,
    position,
    useTarget,
  });
  await interaction.reply(response);
  if (followUp) {
    const stamina =
      global.engine.games[interaction.guildId].players[interaction.user.id]
        .stamina;
    setTimeout(async () => {
      if (
        global.engine.games[interaction.guildId].status !== GAME_STATUS.started
      )
        return;
      if (
        global.engine.games[interaction.guildId].players[interaction.user.id]
          .preload
      ) {
        // console.log("PRELOAD");
        // preload
        setTimeout(async () => {
          await recurredExecute(interaction);
        }, 1000);
      } else {
        // regular stamina message
        await interaction.followUp(followUp);
      }
    }, Math.abs(stamina * gameSpeedModifier));
  }
};

const getCrit = () => Math.random() > 0.77;

const BOT_TYPES = {
  AFK: "AFK",
  Lv1: "Lv1",
  Lv2: "Lv2",
  Lv3: "Lv3",
  Lv4: "Lv4",
  Lv5: "Lv5",
};

const BOT_HANDICAPS = {
  [BOT_TYPES.Lv1]: 10,
  [BOT_TYPES.Lv2]: 5,
  [BOT_TYPES.Lv3]: 0,
  [BOT_TYPES.AFK]: 0,
  [BOT_TYPES.Lv4]: -3,
  [BOT_TYPES.Lv5]: -6,
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

module.exports = {
  GAME_STATUS,
  MAX_HP,
  MAX_STAMINA,
  ACTIONS,
  PUNCH_TYPES,
  KICK_TYPES,
  getExecute,
  LEG_DAMAGE_THRESHOLD,
  LEG_DAMAGE_THRESHOLD_MAX,
  GRAPPLE_TYPES,
  DODGE_TYPES,
  POSITION_MAP,
  DODGE_MAP,
  COUNTER_DAMAGE,
  GUARD_TYPES,
  getCrit,
  GRAPPLE_DAMAGE,
  GRAPPLE_LIMIT,
  SPEED_TYPES,
  SPEED_MAP,
  TAUNT_TYPES,
  BOT_TYPES,
  shuffle,
  BOT_HANDICAPS,
};
