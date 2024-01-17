const { ACTIONS, shuffle } = require("./CONST");

const getBotAction = ({ player, game }) => {
  const chosenActionId = shuffle(Object.keys(ACTIONS))[0];
  const position = shuffle(Object.keys(ACTIONS[chosenActionId].args))[0];

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

  return `\n-----------\n${response.response.content}`;
};

module.exports = {
  getBotAction,
};
