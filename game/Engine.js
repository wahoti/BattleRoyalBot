const Game = require("./Game");
const { GAME_STATUS } = require("./CONST");

class Engine {
  constructor() {
    console.log("ENGINE");

    // 1 game per server
    this.games = {};
  }

  gameCreate(guildId) {
    this.games[guildId] = new Game(guildId);
    return "game created";
  }

  gameStart(guildId) {
    if (!this.games[guildId]) return "game not found, create one first";
    this.games[guildId].gameStart();
    return "game started";
  }

  gameEnd(guildId) {
    if (!this.games[guildId]) return "game not found";
    this.games[guildId].gameEnd();
    this.games[guildId] = undefined;
    return "game ended";
  }

  gameJoin({ guildId, playerId, name }) {
    if (!this.games[guildId]) return "game not found";
    if (!this.games[guildId].gameStatus === "STARTED")
      return "game in progress";
    if (!this.games[guildId].gameStatus === "ENDED") return "game over";
    this.games[guildId].gameJoin({ playerId, name });
    return `game joined, ${
      Object.keys(this.games[guildId].players).length
    } players`;
  }

  gameStatus(guildId) {
    if (!this.games[guildId]) return "game not found";
    const playersString = Object.values(this.games[guildId].players).reduce(
      (acc, player) => {
        return `${acc}\n${player.name}`;
      },
      ""
    );
    return `game status: ${this.games[guildId].gameStatus}\nplayers: ${
      Object.keys(this.games[guildId].players).length
    }\n${playersString}`;
  }

  gameAction({ guildId, playerId, targetId, actionId }) {
    if (!this.games[guildId]) {
      return {
        content: "game not found",
        error: true,
      };
    }
    if (this.games[guildId].gameStatus !== GAME_STATUS.STARTED) {
      return {
        content: `game not started, ${this.games[guildId].gameStatus}`,
        error: true,
      };
    }
    if (!this.games[guildId].players[playerId]) {
      return {
        content: "player not found",
        error: true,
      };
    }
    if (!this.games[guildId].players[targetId]) {
      return {
        content: "target not found",
        error: true,
      };
    }
    if (!this.games[guildId][actionId]) {
      return {
        content: "action not found",
        error: true,
      };
    }
    const actionResponse = this.games[guildId][actionId]({
      playerId,
      targetId,
    });
    return {
      content: actionResponse,
      error: false,
    };
  }
}

module.exports = Engine;
