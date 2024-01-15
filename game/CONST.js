const GAME_TIC = "1000";
const POLL_TIC = "1000";

const GAME_STATUS = {
  CREATED: "CREATED",
  STARTED: "STARTED",
  ENDED: "ENDED",
};

const PLAYER_STATUS = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
};

const MAX_HP = 10;
const MAX_STAMINA = 1;

const ACTIONS = {
  punch: {
    name: "punch",
    cost: 10,
  },
};

const PUNCH_TYPES = {
  Jab: "Jab",
  Cross: "Cross",
  Body: "Body",
};

async function execute(interaction) {
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
  if (followUp) {
    const stamina =
      global.engine.games[interaction.guildId].players[interaction.user.id]
        .stamina;
    setTimeout(async () => {
      await interaction.followUp(followUp);
    }, Math.abs(stamina * 1000));
  }
}

module.exports = {
  GAME_STATUS,
  GAME_TIC,
  POLL_TIC,
  MAX_HP,
  MAX_STAMINA,
  ACTIONS,
  PLAYER_STATUS,
  PUNCH_TYPES,
  execute,
};
