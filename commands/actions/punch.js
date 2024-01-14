const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punch")
    .setDescription("punch")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The player to target")
        .setRequired(true)
    ),
  // .addStringOption((option) =>
  //   option.setName("input").setDescription("The input to echo back")
  // ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const { content: response, error } = global.engine.gameAction({
      guildId: interaction.guildId,
      playerId: interaction.user.id,
      targetId: target.id,
      actionId: "punch",
    });
    await interaction.reply({ content: response, ephemeral: error });
  },
};
