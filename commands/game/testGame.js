const { SlashCommandBuilder } = require("discord.js");

const { SPEED_TYPES, BOT_TYPES } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test-game")
    .setDescription("creates and starts a test game")
    .addStringOption((option) =>
      option
        .setName("level")
        .setDescription("bot level")
        .setRequired(false)
        .addChoices(
          { name: BOT_TYPES.Lv1, value: BOT_TYPES.Lv1 },
          { name: BOT_TYPES.Lv2, value: BOT_TYPES.Lv2 },
          { name: BOT_TYPES.Lv3, value: BOT_TYPES.Lv3 },
          { name: BOT_TYPES.Lv4, value: BOT_TYPES.Lv4 },
          { name: BOT_TYPES.Lv5, value: BOT_TYPES.Lv5 },
          { name: BOT_TYPES.AFK, value: BOT_TYPES.AFK }
        )
    )
    .addStringOption((option) =>
      option
        .setName("speed")
        .setDescription("game speed")
        .setRequired(false)
        .addChoices(
          { name: SPEED_TYPES.Fast, value: SPEED_TYPES.Fast },
          { name: SPEED_TYPES.Medium, value: SPEED_TYPES.Medium },
          { name: SPEED_TYPES.Slow, value: SPEED_TYPES.Slow }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("player")
        .setDescription("Whether or not the player joins the game")
    ),
  async execute(interaction) {
    const speed = interaction.options.getString("speed");
    const level = interaction.options.getString("level");
    const playerJoin = interaction.options.getBoolean("player");

    const nickname = interaction.member.nickname;
    const name = interaction.user.username;
    const responses = [];

    // CREATE GAME
    const {
      content: createResponse,
      error: createError,
    } = global.engine.gameCreate({
      guildId: interaction.guildId,
      speed: speed ? speed : SPEED_TYPES.Fast,
      test: true,
      channelId: interaction.channelId,
    });

    if (createError) {
      await interaction.reply({ content: createResponse, ephemeral: true });
    } else {
      responses.push(createResponse);
    }

    // PLAYER JOIN GAME
    if (playerJoin) {
      const {
        content: playerResponse,
        error: playerError,
      } = global.engine.gameJoin({
        guildId: interaction.guildId,
        playerId: interaction.user.id,
        name: nickname || name,
      });

      if (playerError) {
        await interaction.reply({ content: playerResponse, ephemeral: true });
      } else {
        responses.push(playerResponse);
      }
    }

    // BOT JOIN GAME
    const { content: botResponse1, error: botError1 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "1037462730812166155",
      name: "BattleRoyalBot",
      bot: level ? level : BOT_TYPES.Lv3,
    });

    if (botError1) {
      await interaction.reply({ content: botResponse1, ephemeral: true });
    } else {
      responses.push(botResponse1);
    }

    const { content: botResponse2, error: botError2 } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "poopoo",
      name: "Cool Guy",
      bot: level ? level : BOT_TYPES.Lv3,
    });

    if (botError2) {
      await interaction.reply({ content: botResponse2, ephemeral: true });
    } else {
      responses.push(botResponse2);
    }

    // START GAME
    const {
      content: startResponse,
      error: startError,
    } = global.engine.gameStart(interaction.guildId);

    if (startError) {
      await interaction.reply({ content: response3, ephemeral: true });
    } else {
      responses.push(startResponse);
    }

    let response = "";
    responses.forEach((actionResponse, index) => {
      response += `${index > 0 ? "\n" : ""}${actionResponse}`;
    });

    await interaction.reply({ content: response, ephemeral: true });
  },
};
