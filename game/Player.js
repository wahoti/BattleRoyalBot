const { MAX_HP, MAX_STAMINA, PLAYER_STATUS } = require("./CONST");

class Player {
  constructor({ playerId, name }) {
    console.log("NEW PLAYER", playerId);
    this.hp = MAX_HP;
    this.stamina = MAX_STAMINA;
    this.name = name;
    this.id = playerId;
    this.status = PLAYER_STATUS.ACTIVE;
  }
}

module.exports = Player;
