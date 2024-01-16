const Player = require("./Player");
const {
  GAME_STATUS,
  GAME_TIC,
  POLL_TIC,
  MAX_STAMINA,
  PLAYER_STATUS,
  PUNCH_TYPES,
  KICK_TYPES,
  ACTIONS,
  LEG_DAMAGE_THRESHOLD,
  LEG_DAMAGE_THRESHOLD_MAX,
  STATUS_EFFECTS,
  DODGE_MAP,
  POSITION_MAP,
  COUNTER_DAMAGE,
  GUARD_TYPES,
  MAX_HP,
  GRAPPLE_TYPES,
  GRAPPLE_DAMAGE,
  GRAPPLE_LIMIT,
  getCrit,
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
    response += `players: ${Object.keys(this.players).length}`;
    const playersString = Object.values(this.players).reduce((acc, player) => {
      let statusString = `${acc}\n${player.name}: ${player.status}`;
      if (player.status !== PLAYER_STATUS.ACTIVE) return statusString;
      statusString += `\n\thp ${player.hp},  `;
      statusString += `\n\tstamina: ${player.stamina}, `;
      statusString += `\n\tstaminaDamage: ${player.staminaDamage}`;
      statusString += `\n\tgrapple level: ${player.grapple}`;
      Object.keys(player.statusEffects).forEach((statusEffect) => {
        if (player.statusEffects[statusEffect]) {
          statusString += `\n\t${statusEffect}`;
        }
      });
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

  grapplePlayer({ targetId, playerId, position }) {
    if (this.players[targetId].guard === GUARD_TYPES.Grapple) {
      return `${this.players[targetId].name} blocked the grapple`;
    }

    this.players[targetId].grapple += 1;

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` grappled (${position}) `;
    actionResponse += this.players[targetId].name;
    actionResponse += ` (level ${this.players[targetId].grapple})`;

    if (this.players[targetId].grapple >= GRAPPLE_LIMIT) {
      actionResponse += `\n${this.damagePlayer({
        targetId: playerId,
        damage: GRAPPLE_DAMAGE,
      })}`;
    }

    return actionResponse;
  }

  damagePlayer({ targetId, damage, crit = false }) {
    let _damage = damage;
    let blocked = "";

    if (crit) _damage = _damage * 2;
    if (this.players[targetId].guard) {
      blocked = " (blocked)";
      _damage = _damage / 2;
    }

    this.players[targetId].hp -= _damage;

    const damageString = `${this.players[targetId].name} took ${_damage} damage${blocked}`;

    if (this.players[targetId].hp <= 0) {
      this.players[targetId].status = PLAYER_STATUS.DISABLED;
      const gameOverResponse = this.checkGameOver();
      return `${damageString}\n${this.players[targetId].name} was disabled!${gameOverResponse}`;
    }

    return damageString;
  }

  staminaDamagePlayer({ targetId, damage }) {
    let _damage = damage;
    let blocked = "";

    if (this.players[targetId].guard) {
      blocked = " (blocked)";
      _damage = _damage / 2;
    }

    this.players[targetId].staminaDamage += _damage;

    return `${this.players[targetId].name} took ${_damage} stamina damage${blocked}`;
  }

  legDamagePlayer({ targetId, damage }) {
    let _damage = damage;
    let blocked = "";

    if (this.players[targetId].guard) {
      blocked = " (blocked)";
      _damage = _damage / 2;
    }

    this.players[targetId].legDamage += _damage;

    if (this.players[targetId].legDamage >= LEG_DAMAGE_THRESHOLD_MAX) {
      this.players[targetId].statusEffects[
        STATUS_EFFECTS.legSeverelyInjured
      ] = true;
      return `${this.players[targetId].name} legs were severely injured!`;
    }
    if (this.players[targetId].legDamage >= LEG_DAMAGE_THRESHOLD) {
      this.players[targetId].statusEffects[STATUS_EFFECTS.legInjured] = true;
      return `${this.players[targetId].name} legs were injured!`;
    }
    return `${this.players[targetId].name} took ${_damage} leg damage${blocked}`;
  }

  payActionCost({ playerId, cost }) {
    let adjustedCost = cost + this.players[playerId].staminaDamage;
    if (this.players[playerId].statusEffects[STATUS_EFFECTS.legInjured]) {
      adjustedCost = adjustedCost * 2;
    }
    if (
      this.players[playerId].statusEffects[STATUS_EFFECTS.legSeverelyInjured]
    ) {
      adjustedCost = adjustedCost * 2;
    }

    this.players[playerId].stamina =
      this.players[playerId].stamina - adjustedCost;
    this.players[playerId].staminaDamage = 0;

    return `${this.players[playerId].name} used ${adjustedCost} stamina`;
  }

  getActionResponse(responses) {
    let content = "";
    responses.forEach((response) => {
      if (response.length) content += `\n${response}`;
    });
    return content;
  }

  doAction({ playerId, targetId, position, actionId }) {
    const { cost, damage, name, props } = ACTIONS[actionId];
    console.log("actionData", { actionId, cost, damage, props });

    const followUp = { content: "stamina recovered", ephemeral: true };

    const costResponse = this.payActionCost({
      playerId,
      cost,
    });

    let preventAction = false;

    if (
      props.dodgeable &&
      this.players[targetId].dodge &&
      DODGE_MAP[this.players[targetId].dodge] !== POSITION_MAP[position]
    ) {
      preventAction = `${this.players[targetId].name} dodged the attack (${name} ${position} ${POSITION_MAP[position]})`;
    }

    if (
      props.counterable &&
      this.players[targetId].counter &&
      this.players[targetId].counter === POSITION_MAP[position]
    ) {
      const crit = getCrit();
      preventAction = `${this.players[targetId].name} countered the attack (${actionId} ${position} ${POSITION_MAP[position]})`;
      if (crit) preventAction += "critical hit!\n";
      preventAction += this.damagePlayer({
        targetId: playerId,
        damage: COUNTER_DAMAGE,
        crit,
      });
    }

    if (preventAction) {
      return {
        response: {
          content: this.getActionResponse([costResponse, preventAction]),
          ephemeral: false,
        },
        followUp,
      };
    }

    const { ephemeral, actionResponse, specialResponse, crit } = this[actionId](
      {
        playerId,
        targetId,
        position,
        props,
      }
    );

    const damageResponse = damage
      ? this.damagePlayer({ targetId, damage, crit })
      : "";

    return {
      response: {
        content: this.getActionResponse([
          costResponse,
          actionResponse,
          specialResponse,
          damageResponse,
        ]),
        ephemeral,
      },
      followUp,
    };
  }

  punch({ playerId, targetId, position, props }) {
    let specialResponse = "";
    let crit = false;

    const { staminaRecovery, staminaDamage } = props;

    switch (position) {
      case PUNCH_TYPES.Jab:
        this.players[playerId].stamina += staminaRecovery;
        specialResponse = `${staminaRecovery} stamina recovered`;
        break;
      case PUNCH_TYPES.Cross:
        if (getCrit()) {
          specialResponse = "critical hit!";
          crit = true;
        }
        break;
      case PUNCH_TYPES.Body:
        specialResponse = this.staminaDamagePlayer({
          targetId,
          damage: staminaDamage,
        });
        break;
      default:
    }

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` punched (${position}) `;
    actionResponse += this.players[targetId].name;

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit,
    };
  }

  kick({ playerId, targetId, position, props }) {
    let specialResponse = "";
    let crit = false;

    const { legDamage, staminaDamage } = props;

    switch (position) {
      case KICK_TYPES.Head:
        if (getCrit()) {
          specialResponse = "critical hit!";
          crit = true;
        }
        break;
      case KICK_TYPES.Body:
        specialResponse = this.staminaDamagePlayer({
          targetId,
          damage: staminaDamage,
        });
        break;
      case KICK_TYPES.Leg:
        specialResponse = this.legDamagePlayer({ targetId, damage: legDamage });
        break;
      default:
    }

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` kicked (${position}) `;
    actionResponse += this.players[targetId].name;

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit,
    };
  }

  grapple({ playerId, targetId, position, props }) {
    let specialResponse = "";
    let crit = false;

    const { staminaDamage, staminaRecovery, throwDamage } = props;

    switch (position) {
      case GRAPPLE_TYPES.Trip:
        // specialResponse = this.legDamagePlayer({ targetId, damage: legDamage });
        this.players[playerId].stamina += staminaRecovery;
        specialResponse = `${staminaRecovery} stamina recovered`;
        break;
      case GRAPPLE_TYPES.Takedown:
        specialResponse = this.staminaDamagePlayer({
          targetId,
          damage: staminaDamage,
        });
        break;
      case GRAPPLE_TYPES.Throw:
        const crit = getCrit();
        if (crit) specialResponse += "critical hit!\n";
        specialResponse += this.damagePlayer({
          targetId,
          damage: throwDamage,
          crit,
        });
        break;
      default:
    }

    let actionResponse = this.grapplePlayer({ targetId, playerId, position });

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit,
    };
  }

  dodge({ playerId, position, props }) {
    let specialResponse = "";

    const { duration } = props;

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` is evading attacks (${duration})`;

    this.players[playerId].dodge = position;
    setTimeout(() => {
      this.players[playerId].dodge = null;
    }, duration * 1000);

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }

  counter({ playerId, position, props }) {
    let specialResponse = "";

    const { duration } = props;

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` is preparing to counter ${position} (${duration})`;

    this.players[playerId].counter = position;
    setTimeout(() => {
      this.players[playerId].counter = null;
    }, duration * 1000);

    return {
      ephemeral: true,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }

  guard({ playerId, props, position }) {
    let specialResponse = "";

    const { duration, staminaRecovery, healthRecovery } = props;

    switch (position) {
      case GUARD_TYPES.Quick:
        this.players[playerId].stamina += staminaRecovery;
        specialResponse = `${staminaRecovery} stamina recovered`;
        break;
      case GUARD_TYPES.Recover:
        this.players[playerId].hp = Math.min(
          this.players[playerId].hp + healthRecovery,
          MAX_HP
        );
        specialResponse = `${healthRecovery} health recovered`;
        break;
      case GUARD_TYPES.Grapple:
        this.players[playerId].grapple = Math.max(
          0,
          this.players[playerId].grapple - 1
        );
        specialResponse = `reduced grapple level to ${this.players[playerId].grapple}`;
        break;
      default:
    }

    this.players[playerId].guard = position;
    setTimeout(() => {
      this.players[playerId].guard = null;
    }, duration * 1000);

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` is guarding attacks (${duration})`;

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }
}

module.exports = Game;
