const { SlashCommandBuilder } = require("discord.js");

const { PUNCH_TYPES, getExecute, ACTIONS } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("act-punch")
    .setDescription(`perform a punch attack, cost ${ACTIONS.punch.cost}`)
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: PUNCH_TYPES.Jab, value: PUNCH_TYPES.Jab },
          { name: PUNCH_TYPES.Cross, value: PUNCH_TYPES.Cross },
          { name: PUNCH_TYPES.Body, value: PUNCH_TYPES.Body }
        )
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The player to target")
        .setRequired(true)
    ),
  execute: getExecute({ actionId: "punch", useTarget: true }),
};
