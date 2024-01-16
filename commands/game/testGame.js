const { SlashCommandBuilder } = require("discord.js");

const { SPEED_TYPES } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test-game")
    .setDescription("creates and starts a test game"),
  async execute(interaction) {
    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const { content: response1, error: error1 } = global.engine.gameCreate({
      guildId: interaction.guildId,
      speed: SPEED_TYPES.Fast,
    });
    if (error1) {
      await interaction.reply({ content: response1, ephemeral: true });
    }
    const { content: response2, error: error2 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      name: nickname || name,
    });
    if (error2) {
      await interaction.reply({ content: response2, ephemeral: true });
    }
    const { content: response3, error: error3 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "1037462730812166155",
      name: "BattleRoyalBot",
    });
    if (error3) {
      await interaction.reply({ content: response3, ephemeral: true });
    }
    const { content: response5, error: error5 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "poopoo",
      name: "BattleRoyalBot2",
    });
    if (error5) {
      await interaction.reply({ content: response5, ephemeral: true });
    }
    const { content: response4, error: error4 } = global.engine.gameStart(
      interaction.guildId
    );
    if (error4) {
      await interaction.reply({ content: response3, ephemeral: true });
    }
    const response = `${response1}\n${response2}\n${response3}\n${response5}\n${response4}`;
    await interaction.reply({ content: response, ephemeral: true });
  },
};
