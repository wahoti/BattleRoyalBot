const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-status")
    .setDescription("game status"),
  async execute(interaction) {
    const response = global.engine.gameStatus(interaction.guildId);
    await interaction.reply({ content: response, ephemeral: true });
  },
};
