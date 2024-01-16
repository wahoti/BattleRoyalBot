const { SlashCommandBuilder } = require("discord.js");

const { DODGE_TYPES, getExecute } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counter")
    .setDescription("counter")
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: DODGE_TYPES.Low, value: DODGE_TYPES.Low },
          { name: DODGE_TYPES.Mid, value: DODGE_TYPES.Mid },
          { name: DODGE_TYPES.High, value: DODGE_TYPES.High }
        )
    ),
  execute: getExecute({ actionId: "counter" }),
};