const { SlashCommandBuilder } = require("discord.js");

const { getExecute, GUARD_TYPES, ACTIONS } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("act-guard")
    .setDescription(`reduce incoming damage, cost ${ACTIONS.guard.cost}`)
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: GUARD_TYPES.Quick, value: GUARD_TYPES.Quick },
          { name: GUARD_TYPES.Recover, value: GUARD_TYPES.Recover },
          { name: GUARD_TYPES.Grapple, value: GUARD_TYPES.Grapple }
        )
    ),
  execute: getExecute({ actionId: "guard" }),
};
