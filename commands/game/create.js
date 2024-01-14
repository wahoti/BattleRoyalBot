const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("creates game"),
  async execute(interaction) {
    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const response1 = global.engine.gameCreate(interaction.guildId);
    const response2 = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      name: nickname || name,
    });
    const response = `${response1}\n${response2}`;
    await interaction.reply({ content: response, ephemeral: false });
  },
};
