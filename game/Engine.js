const Player = require("./Player");

const GAME_TIC = "1000";
const POLL_TIC = "1000";

const GAME_STATUS = {
  CREATED: "CREATED",
  STARTED: "STARTED",
  ENDED: "ENDED",
};

class Engine {
  constructor() {
    console.log("ENGINE");

    this.players = {};
    this.agents = {};

    this.gameInterval = null;
    this.pollInterval = null;

    this.gameStatus = GAME_STATUS.CREATED;
  }

  addPlayer(playerId) {
    this.players[playerId] = new Player(playerId);
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

  startGame() {
    console.log("start game");
    this.gameStatus = GAME_STATUS.STARTED;
  }

  endGame() {
    console.log("end game");
    this.gameStatus = GAME_STATUS.ENDED;
  }

  status() {
    console.log("game status", this.gameStatus);
  }
}

module.exports = Engine;
