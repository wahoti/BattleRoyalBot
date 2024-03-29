const Game = require("./Game");
const { GAME_STATUS } = require("./CONST");

class Engine {
  constructor() {
    console.log("ENGINE");

    // 1 game per server
    this.games = {};

    // set on login
    this.client = null;
  }

  gameCreate({ guildId, speed, channelId, test }) {
    if (this.games[guildId]) {
      this.games[guildId].gameEnd();
    }
    this.games[guildId] = new Game({ guildId, speed, channelId, test });
    return {
      error: false,
      content: `game created ${speed}`,
    };
  }

  gameStart(guildId) {
    if (!this.games[guildId])
      return {
        content: "game not found, create one first",
        error: false,
      };
    if (this.games[guildId].gameStatus !== GAME_STATUS.CREATED) {
      return {
        content: `game not start-able, ${this.games[guildId].gameStatus}`,
        error: false,
      };
    }
    if (Object.keys(this.games[guildId].players).length < 2) {
      return {
        content: `game not start-able, not enough players`,
        error: false,
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

  gameJoin({ guildId, playerId, name, bot }) {
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
    this.games[guildId].gameJoin({ playerId, name, bot });
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

  gameAction({ guildId, playerId, targetId, actionId, position, useTarget }) {
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
    if (!this.games[guildId][actionId]) {
      return {
        response: {
          content: "action not found",
          ephemeral: true,
        },
      };
    }
    if (this.games[guildId].players[playerId].hp <= 0) {
      return {
        response: {
          content: "player disabled",
          ephemeral: true,
        },
      };
    }
    if (this.games[guildId].players[playerId].stamina <= 0) {
      let outOfStaminaContent = `out of stamina, (${this.games[
        guildId
      ].getDuration(this.games[guildId].players[playerId].stamina)}s)`;
      this.games[guildId].players[playerId].preload = () =>
        this.games[guildId].doAction({
          playerId,
          targetId,
          useTarget,
          position,
          actionId,
        });
      outOfStaminaContent += `\npreloading action ${actionId} ${position}`;
      return {
        response: {
          content: outOfStaminaContent,
          ephemeral: true,
        },
      };
    }
    return this.games[guildId].doAction({
      playerId,
      targetId,
      useTarget,
      position,
      actionId,
    });
  }
}

module.exports = Engine;
