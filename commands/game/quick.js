const { SlashCommandBuilder } = require("discord.js");

const { SPEED_TYPES, BOT_TYPES } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-quick")
    .setDescription("creates and starts a game with a bot")
    .addStringOption((option) =>
      option
        .setName("level")
        .setDescription("bot level")
        .setRequired(true)
        .addChoices(
          { name: BOT_TYPES.Lv1, value: BOT_TYPES.Lv1 },
          { name: BOT_TYPES.Lv2, value: BOT_TYPES.Lv2 },
          { name: BOT_TYPES.Lv3, value: BOT_TYPES.Lv3 }
        )
    )
    .addStringOption((option) =>
      option
        .setName("speed")
        .setDescription("game speed")
        .setRequired(true)
        .addChoices(
          { name: SPEED_TYPES.Fast, value: SPEED_TYPES.Fast },
          { name: SPEED_TYPES.Medium, value: SPEED_TYPES.Medium },
          { name: SPEED_TYPES.Slow, value: SPEED_TYPES.Slow }
        )
    ),
  async execute(interaction) {
    const level = interaction.options.getString("level");
    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const speed = interaction.options.getString("speed");

    // CREATE GAME
    const { content: response1, error: error1 } = global.engine.gameCreate({
      guildId: interaction.guildId,
      speed,
      test: true,
      channelId: interaction.channelId,
    });
    if (error1) {
      await interaction.reply({ content: response1, ephemeral: true });
    }

    // PLAYER JOIN GAME
    const { content: response2, error: error2 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      name: nickname || name,
    });
    if (error2) {
      await interaction.reply({ content: response2, ephemeral: true });
    }

    // BOT JOINS GAME
    const { content: response3, error: error3 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "1037462730812166155",
      name: "BattleRoyalBot",
      bot: level,
    });
    if (error3) {
      await interaction.reply({ content: response3, ephemeral: true });
    }

    // START GAME
    const { content: response4, error: error4 } = global.engine.gameStart(
      interaction.guildId
    );
    if (error4) {
      await interaction.reply({ content: response3, ephemeral: true });
    }

    const response = `${response1}\n${response2}\n${response3}\n${response4}`;

    await interaction.reply({ content: response, ephemeral: true });
  },
};
