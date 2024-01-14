const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("end").setDescription("end game"),
  async execute(interaction) {
    const response = global.engine.gameEnd(interaction.guildId);
    await interaction.reply({ content: response, ephemeral: false });
  },
};
