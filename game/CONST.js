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

const ACTIONS = {
  punch: {
    name: "punch",
    cost: 10,
  },
};

const PUNCH_TYPES = {
  Jab: "Jab",
  Cross: "Cross",
  Body: "Body",
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
};
