const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test-game")
    .setDescription("creates and starts a test game"),
  async execute(interaction) {
    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const response1 = global.engine.gameCreate(interaction.guildId);
    const response2 = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      name: nickname || name,
    });
    const response3 = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "1037462730812166155",
      name: "BattleRoyalBot",
    });
    const response4 = global.engine.gameStart(interaction.guildId);
    const response = `${response1}\n${response2}\n${response3}\n${response4}`;
    await interaction.reply({ content: response, ephemeral: true });
  },
};
