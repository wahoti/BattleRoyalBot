const { SlashCommandBuilder } = require("discord.js");

const { BOT_TYPES } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-add-bot")
    .setDescription("adds a bot to the game")
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
    ),
  async execute(interaction) {
    const { content: response, error } = global.engine.gameJoin({
      guildId: interaction.guildId,
      playerId: "1037462730812166155",
      name: "BattleRoyalBot",
      bot: BOT_TYPES.Lv1,
    });
    await interaction.reply({ content: response, ephemeral: error });
  },
};
