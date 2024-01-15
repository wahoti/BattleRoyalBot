const { MAX_HP, MAX_STAMINA, PLAYER_STATUS } = require("./CONST");

class Player {
  constructor({ playerId, name }) {
    console.log("NEW PLAYER", playerId);
    this.hp = MAX_HP;
    this.stamina = MAX_STAMINA;
    this.staminaDamage = 0;
    this.legDamage = 0;
    this.name = name;
    this.id = playerId;
    this.status = PLAYER_STATUS.ACTIVE;
    this.statusEffects = {
      poopoo: "doodoo",
    };
  }
}

module.exports = Player;
