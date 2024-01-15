const { SlashCommandBuilder } = require("discord.js");

const { PUNCH_TYPES } = require("../../game/CONST");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punch")
    .setDescription("punch for damage")
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("position")
        .setRequired(true)
        .addChoices(
          { name: PUNCH_TYPES.Jab, value: PUNCH_TYPES.Jab },
          { name: PUNCH_TYPES.Cross, value: PUNCH_TYPES.Cross },
          { name: PUNCH_TYPES.Body, value: PUNCH_TYPES.Body }
        )
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The player to target")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const position = interaction.options.getString("position");
    const { content: response, error, followUp } = global.engine.gameAction({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      targetId: target.id,
      actionId: "punch",
      position,
    });
    await interaction.reply({ content: response, ephemeral: error });
    const stamina =
      global.engine.games[interaction.guildId].players[interaction.user.id]
        .stamina;
    setTimeout(async () => {
      await interaction.followUp(followUp);
    }, Math.abs(stamina * 1000));
  },
};
