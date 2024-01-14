const Game = require("./Game");

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
    this.games[guildId] = undefined;
    return "game ended";
  }

  gameJoin(guildId, playerId) {
    if (!this.games[guildId]) return "game not found";
    if (!this.games[guildId].gameStatus === "STARTED")
      return "game in progress";
    if (!this.games[guildId].gameStatus === "ENDED") return "game over";
    this.games[guildId].gameJoin(playerId);
    return `game joined, ${
      Object.keys(this.games[guildId].players).length
    } players`;
  }

  gameStatus(guildId) {
    if (!this.games[guildId]) return "game not found";
    return this.games[guildId].gameStatus;
  }
}

module.exports = Engine;
