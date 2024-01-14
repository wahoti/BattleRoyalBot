const Player = require("./Player");

const GAME_TIC = "1000";
const POLL_TIC = "1000";

const GAME_STATUS = {
  CREATED: "CREATED",
  STARTED: "STARTED",
  ENDED: "ENDED",
};

class Game {
  constructor(guildId) {
    console.log("GAME", guildId);

    this.guildId = guildId;

    this.players = {};
    this.agents = {};

    this.gameInterval = null;
    this.pollInterval = null;

    this.gameStatus = GAME_STATUS.CREATED;
  }

  gameStep() {
    console.log("game step");
  }

  pollStep() {
    console.log("poll step");
  }

  setIntervals() {
    this.pollInterval = setInterval(() => {
      this.pollStep();
    }, POLL_TIC);
    this.gameInterval = setInterval(() => {
      this.gameStep();
    }, GAME_TIC);
  }

  clearIntervals() {
    clearInterval(this.pollInterval);
    clearInterval(this.gameInterval);
  }

  gameStart() {
    this.gameStatus = GAME_STATUS.STARTED;
  }

  gameEnd() {
    this.gameStatus = GAME_STATUS.ENDED;
  }

  gameJoin(playerId) {
    this.players[playerId] = new Player(playerId);
  }
}

module.exports = Game;
