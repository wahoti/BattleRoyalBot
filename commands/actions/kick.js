const { SlashCommandBuilder } = require("discord.js");

const { KICK_TYPES, getExecute } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick for damage")
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: KICK_TYPES.Head, value: KICK_TYPES.Head },
          { name: KICK_TYPES.Body, value: KICK_TYPES.Body },
          { name: KICK_TYPES.Leg, value: KICK_TYPES.Leg }
        )
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The player to target")
        .setRequired(true)
    ),
  execute: getExecute("kick"),
};
