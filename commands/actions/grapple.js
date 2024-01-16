const { SlashCommandBuilder } = require("discord.js");

const { GRAPPLE_TYPES, getExecute } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("attack-grapple")
    .setDescription("perform a grapple attack")
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: GRAPPLE_TYPES.Trip, value: GRAPPLE_TYPES.Trip },
          { name: GRAPPLE_TYPES.Takedown, value: GRAPPLE_TYPES.Takedown },
          { name: GRAPPLE_TYPES.Throw, value: GRAPPLE_TYPES.Throw }
        )
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The player to target")
        .setRequired(true)
    ),
  execute: getExecute({ actionId: "grapple", useTarget: true }),
};
