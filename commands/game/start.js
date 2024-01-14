const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("starts game"),
  async execute(interaction) {
    const response = global.engine.gameStart(interaction.guildId);
    await interaction.reply(response);
  },
};
