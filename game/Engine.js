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
    const playersString = Object.values(this.games[guildId].players).reduce(
      (acc, player) => {
        return `${acc}\n${player.name}: ${player.status}, hp ${player.hp},  stamina: ${player.stamina}`;
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
    if (this.games[guildId].status === GAME_STATUS.ENDED) {
      return {
        content: `GAME OVER\n${this.games[guildId]} wins!`,
        error: false,
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
    if (this.games[guildId].players[playerId].status !== PLAYER_STATUS.ACTIVE) {
      return {
        content: `player inactive, ${this.games[guildId].players[playerId].status}`,
        error: true,
      };
    }
    if (this.games[guildId].players[playerId].stamina <= 0) {
      return {
        content: `out of stamina, ${this.games[guildId].players[playerId].stamina}`,
        error: true,
      };
    }
    this.games[guildId].players[playerId].stamina -= ACTIONS[actionId].cost;
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
