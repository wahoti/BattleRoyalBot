const Player = require("./Player");
const {
  GAME_STATUS,
  GAME_TIC,
  POLL_TIC,
  MAX_STAMINA,
  PLAYER_STATUS,
  PUNCH_TYPES,
} = require("./CONST");

class Game {
  constructor(guildId) {
    console.log("NEW GAME", guildId);

    this.guildId = guildId;

    this.players = {};
    this.agents = {};

    this.gameInterval = null;
    this.pollInterval = null;

    this.gameStatus = GAME_STATUS.CREATED;
    this.winner = null;
  }

  gameStep() {}

  pollStep() {
    Object.values(this.players).forEach((player) => {
      if (player.stamina < MAX_STAMINA) {
        player.stamina += 1;
      }
    });

    this.checkGameOver();
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
    this.setIntervals();
    this.gameStatus = GAME_STATUS.STARTED;
  }

  gameEnd() {
    this.clearIntervals();
    this.gameStatus = GAME_STATUS.ENDED;
  }

  gameJoin({ playerId, name }) {
    this.players[playerId] = new Player({ playerId, name });
  }

  getGameStatus() {
    let response = `game status: ${this.gameStatus}\n`;
    response += `players: ${Object.keys(this.players).length}\n`;
    const playersString = Object.values(this.players).reduce((acc, player) => {
      let statusString = `${acc}\n${player.name}: ${player.status}`;
      if (player.status !== PLAYER_STATUS.ACTIVE) return statusString;
      statusString += `\n\thp ${player.hp},  `;
      statusString += `\n\tstamina: ${player.stamina}, `;
      statusString += `\n\tstaminaDamage: ${player.staminaDamage}\n`;
      return statusString;
    }, "");
    response += playersString;
    return response;
  }

  checkGameOver() {
    let activePlayers = 0;
    let activePlayer = "no one";

    Object.values(this.players).forEach((player) => {
      if (player.status === PLAYER_STATUS.ACTIVE) {
        activePlayers += 1;
        activePlayer = player.name;
      }
    });

    if (activePlayers <= 1) {
      this.winner = activePlayer;
      this.gameStatus = GAME_STATUS.ENDED;
      return `\nGAME OVER: ${this.winner} wins!`;
    }
    return "";
  }

  damagePlayer({ targetId, damage, crit }) {
    const _damage = crit ? damage * 2 : damage;
    this.players[targetId].hp -= _damage;
    const damageString = `\n${this.players[targetId].name} took ${_damage} damage`;
    if (this.players[targetId].hp <= 0) {
      this.players[targetId].status = PLAYER_STATUS.DISABLED;
      const gameOverResponse = this.checkGameOver();
      return `${damageString}\n${this.players[targetId].name} was disabled!${gameOverResponse}`;
    }
    return damageString;
  }

  staminaDamagePlayer({ targetId, damage }) {
    this.players[targetId].staminaDamage += damage;
    return `${this.players[targetId].name} took ${damage} stamina damage`;
  }

  payActionCost({ playerId, cost }) {
    const adjustedCost = cost + this.players[playerId].staminaDamage;
    this.players[playerId].stamina =
      this.players[playerId].stamina -
      cost -
      this.players[playerId].staminaDamage;
    this.players[playerId].staminaDamage = 0;
    return `${this.players[playerId].name} used ${adjustedCost} stamina`;
  }

  getActionResponse({ targetId, playerId, actionString, responses }) {
    let content = "";
    content += this.players[playerId].name;
    content += actionString;
    content += this.players[targetId].name;
    responses.forEach((response) => {
      content += response;
    });
    return content;
  }

  punch({ playerId, targetId, position }) {
    console.log("punch", position);

    let specialResponse = "";
    let crit = false;
    switch (position) {
      case PUNCH_TYPES.Jab:
        this.players[playerId].stamina += 3;
        specialResponse = "\n3 stamina recovered (jab)";
        break;
      case PUNCH_TYPES.Cross:
        if (Math.random() > 0.77) {
          specialResponse = "\ncritical hit! extra damage (cross)";
          crit = true;
        }
        break;
      case PUNCH_TYPES.Body:
        specialResponse = `\n${this.staminaDamagePlayer({
          targetId,
          damage: 3,
        })} (body)`;
        break;
      default:
    }

    const damageResponse = this.damagePlayer({ targetId, damage: 2, crit });

    return {
      content: this.getActionResponse({
        playerId,
        targetId,
        responses: [specialResponse, damageResponse],
        actionString: ` punched (${position}) `,
      }),
      error: false,
    };
  }
}

module.exports = Game;
