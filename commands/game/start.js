const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-start")
    .setDescription("starts game"),
  async execute(interaction) {
    await interaction.reply({ content: "3.. 2.. 1..", ephemeral: false });
    setTimeout(async () => {
      const { content: response, error } = global.engine.gameStart(
        interaction.guildId
      );
      await interaction.followUp({ content: response, ephemeral: error });
    }, 3000);
  },
};
