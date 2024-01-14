const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("creates game"),
  async execute(interaction) {
    const response = global.engine.gameCreate(interaction.guildId);
    await interaction.reply(response);
  },
};
