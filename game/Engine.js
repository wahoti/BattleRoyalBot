const Game = require("./Game");
const { GAME_STATUS, ACTIONS, PLAYER_STATUS } = require("./CONST");

class Engine {
  constructor() {
    console.log("ENGINE");

    // 1 game per server
    this.games = {};
  }

  gameCreate(guildId) {
    if (this.games[guildId]) {
      this.games[guildId].gameEnd();
    }
    this.games[guildId] = new Game(guildId);
    return {
      error: false,
      content: "game created",
    };
  }

  gameStart(guildId) {
    if (!this.games[guildId])
      return {
        content: "game not found, create one first",
        error: true,
      };
    if (this.games[guildId].gameStatus !== GAME_STATUS.CREATED) {
      return {
        error: true,
        content: `game not start-able, ${this.games[guildId].gameStatus}`,
      };
    }
    if (Object.keys(this.games[guildId].players).length < 2) {
      return {
        error: true,
        content: `game not start-able, not enough players`,
      };
    }
    this.games[guildId].gameStart();
    return {
      content: "game started",
      error: false,
    };
  }

  gameEnd(guildId) {
    if (!this.games[guildId]) return "game not found";
    this.games[guildId].gameEnd();
    this.games[guildId] = undefined;
    return "game ended";
  }

  gameJoin({ guildId, playerId, name }) {
    if (!this.games[guildId])
      return {
        error: true,
        content: "game not found",
      };
    if (this.games[guildId].gameStatus !== GAME_STATUS.CREATED) {
      return {
        error: true,
        content: `game not joinable, ${this.games[guildId].gameStatus}`,
      };
    }
    this.games[guildId].gameJoin({ playerId, name });
    return {
      error: false,
      content: `game joined, ${
        Object.keys(this.games[guildId].players).length
      } players`,
    };
  }

  gameStatus(guildId) {
    if (!this.games[guildId]) return "game not found";
    if (this.games[guildId].status === "ENDED") {
      return `GAME OVER\n${this.games[guildId]} wins!`;
    }
    return this.games[guildId].getGameStatus();
  }

  gameAction({ guildId, playerId, targetId, actionId, position }) {
    if (!this.games[guildId]) {
      return {
        response: {
          content: "game not found",
          ephemeral: true,
        },
      };
    }
    if (this.games[guildId].status === GAME_STATUS.ENDED) {
      return {
        response: {
          content: `GAME OVER\n${this.games[guildId]} wins!`,
          ephemeral: false,
        },
      };
    }
    if (this.games[guildId].gameStatus !== GAME_STATUS.STARTED) {
      return {
        response: {
          content: `game not started, ${this.games[guildId].gameStatus}`,
          ephemeral: true,
        },
      };
    }
    if (!this.games[guildId].players[playerId]) {
      return {
        response: {
          content: "player not found",
          ephemeral: true,
        },
      };
    }
    if (!this.games[guildId].players[targetId]) {
      return {
        response: {
          content: "target not found",
          ephemeral: true,
        },
      };
    }
    if (!this.games[guildId][actionId]) {
      return {
        response: {
          content: "action not found",
          ephemeral: true,
        },
      };
    }
    if (this.games[guildId].players[playerId].status !== PLAYER_STATUS.ACTIVE) {
      return {
        response: {
          content: `player inactive, ${this.games[guildId].players[playerId].status}`,
          ephemeral: true,
        },
      };
    }
    if (this.games[guildId].players[playerId].stamina <= 0) {
      return {
        response: {
          content: `out of stamina, ${this.games[guildId].players[playerId].stamina}`,
          ephemeral: true,
        },
      };
    }
    return this.games[guildId].doAction({
      playerId,
      targetId,
      position,
      actionId,
    });
  }
}

module.exports = Engine;
