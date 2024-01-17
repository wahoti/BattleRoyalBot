const { SlashCommandBuilder } = require("discord.js");

const { SPEED_TYPES } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-create")
    .setDescription("creates game")
    .addStringOption((option) =>
      option
        .setName("speed")
        .setDescription("speed")
        .setRequired(true)
        .addChoices(
          { name: SPEED_TYPES.Fast, value: SPEED_TYPES.Fast },
          { name: SPEED_TYPES.Medium, value: SPEED_TYPES.Medium },
          { name: SPEED_TYPES.Slow, value: SPEED_TYPES.Slow }
        )
    ),
  async execute(interaction) {
    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const speed = interaction.options.getString("speed");
    const { content: response1, error: error1 } = global.engine.gameCreate({
      guildId: interaction.guildId,
      speed,
      test: true,
      channelId: interaction.channelId,
    });
    if (error1) {
      await interaction.reply({ content: response1, ephemeral: true });
    }
    const { content: response2, error: error2 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      name: nickname || name,
      bot: false,
    });
    if (error2) {
      await interaction.reply({ content: response2, ephemeral: true });
    }
    const response = `${response1}\n${response2}`;
    await interaction.reply({ content: response, ephemeral: false });
  },
};
