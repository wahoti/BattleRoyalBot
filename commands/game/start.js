const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("starts game"),
  async execute(interaction) {
    const { content: response, error } = global.engine.gameStart(
      interaction.guildId
    );
    await interaction.reply({ content: response, ephemeral: error });
  },
};
