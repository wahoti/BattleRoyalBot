const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("starts game"),
  async execute(interaction) {
    global.engine.status();
    await interaction.reply("start");
  },
};
