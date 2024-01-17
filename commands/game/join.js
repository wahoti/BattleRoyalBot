const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-join")
    .setDescription("join game"),
  async execute(interaction) {
    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const { content: response, error } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      name: nickname || name,
      bot: false,
    });
    await interaction.reply({ content: response, ephemeral: error });
  },
};
