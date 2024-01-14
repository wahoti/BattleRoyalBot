const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("game status"),
  async execute(interaction) {
    const status = global.engine.gameStatus(interaction.guildId);
    await interaction.reply(status);
  },
};
