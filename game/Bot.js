const {
  ACTIONS,
  shuffle,
  GUARD_TYPES,
  PUNCH_TYPES,
  LEG_DAMAGE_THRESHOLD,
} = require("./CONST");

const SYSTEM_TEXT = "\n-----------\n";

// TODO
// when a bot is created assign it a random style
// here we can look at the style to weight certain moves

const getBotAction = ({ player, game }) => {
  let chosenActionId = shuffle(Object.keys(ACTIONS))[0];
  let position = shuffle(Object.keys(ACTIONS[chosenActionId].args))[0];

  if (!player.counter && Math.random() > 0.95) {
    chosenActionId = "counter";
    position = shuffle(Object.keys(ACTIONS[chosenActionId].args))[0];
  }

  if (Math.random() > 0.95) {
    chosenActionId = "punch";
    position = PUNCH_TYPES.Jab;
  }

  if (player.legDamage >= LEG_DAMAGE_THRESHOLD && Math.random() > 0.75) {
    chosenActionId = "guard";
    position = GUARD_TYPES.Recover;
  }

  if (player.grapple && Math.random() > 0.75) {
    chosenActionId = "guard";
    position = GUARD_TYPES.Grapple;
  }

  const response = game.doAction({
    playerId: player.id,
    targetId: "",
    useTarget: ACTIONS[chosenActionId].props.useTarget,
    position,
    actionId: chosenActionId,
  });

  if (response.response.ephemeral) {
    return "";
  }

  return `${SYSTEM_TEXT}${response.response.content}`;
};

const BOT_STYLES = {
  aggressive: "aggressive",
};

const getBotStyle = () => {
  const newBot = shuffle(Object.values(BOT_STYLES))[0];
  return newBot;
};

module.exports = {
  getBotAction,
  getBotStyle,
};
