const { SlashCommandBuilder } = require("discord.js");

const { TAUNT_TYPES, getExecute, ACTIONS } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("utility-taunt")
    .setDescription(`perform aoe effects, cost ${ACTIONS.taunt.cost}`)
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: TAUNT_TYPES.Distract, value: TAUNT_TYPES.Distract },
          { name: TAUNT_TYPES.Rage, value: TAUNT_TYPES.Rage },
          { name: TAUNT_TYPES.Throw, value: TAUNT_TYPES.Throw }
        )
    ),
  execute: getExecute({ actionId: "taunt", useTarget: false }),
};
