class Player {
  constructor({ playerId, name }) {
    console.log("NEW PLAYER", playerId);
    this.hp = 10;
    this.name = name;
    this.id = playerId;
  }
}

module.exports = Player;
