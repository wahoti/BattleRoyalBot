const { MAX_HP, MAX_STAMINA } = require("./CONST");

class Player {
  constructor({ playerId, name, bot }) {
    console.log("NEW PLAYER", playerId);
    this.hp = MAX_HP;
    this.stamina = MAX_STAMINA;
    this.staminaDamage = 0;
    this.legDamage = 0;
    this.name = name;
    this.id = playerId;
    this.bot = bot;

    // STATUS
    this.dodge = null;
    this.counter = null;
    this.guard = null;
    this.grapple = 0;
    this.rage = 0;
    this.weak = 0;
  }
}

module.exports = Player;
