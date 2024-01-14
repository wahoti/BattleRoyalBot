const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("join").setDescription("join game"),
  async execute(interaction) {
    const response = global.engine.gameJoin(
      interaction.guildId,
      interaction.user.id
    );
    await interaction.reply(response);
  },
};
