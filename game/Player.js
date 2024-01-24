const { MAX_HP, MAX_STAMINA } = require("./CONST");
const { getBotStyle } = require("./Bot");

class Player {
  constructor({ playerId, name, bot }) {
    console.log("NEW PLAYER", playerId);

    // META
    this.name = name;
    this.id = playerId;
    this.bot = bot;
    if (bot) {
      this.style = getBotStyle();
    }

    // UTILITY
    this.preload = null;

    // STATUS
    this.hp = MAX_HP;
    this.stamina = MAX_STAMINA;
    this.staminaDamage = 0;
    this.legDamage = 0;
    this.dodge = null;
    this.counter = null;
    this.guard = null;
    this.grapple = 0;
    this.rage = 0;
    this.weak = 0;
  }
}

module.exports = Player;
