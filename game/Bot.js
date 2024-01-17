const { ACTIONS, PUNCH_TYPES } = require("./CONST");

const getBotAction = ({ player, game }) => {
  const chosenActionId = "punch";
  const position = PUNCH_TYPES.Jab;

  const response = game.doAction({
    playerId: player.id,
    targetId: "",
    useTarget: ACTIONS[chosenActionId].props.useTarget,
    position,
    actionId: chosenActionId,
  });

  return response.response.content;
};

module.exports = {
  getBotAction,
};
