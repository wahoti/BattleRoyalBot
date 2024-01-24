const Player = require("./Player");
const { getBotAction } = require("./Bot");
const {
  GAME_STATUS,
  MAX_STAMINA,
  PUNCH_TYPES,
  KICK_TYPES,
  ACTIONS,
  LEG_DAMAGE_THRESHOLD,
  LEG_DAMAGE_THRESHOLD_MAX,
  DODGE_MAP,
  POSITION_MAP,
  COUNTER_DAMAGE,
  GUARD_TYPES,
  MAX_HP,
  GRAPPLE_TYPES,
  GRAPPLE_DAMAGE,
  GRAPPLE_LIMIT,
  SPEED_MAP,
  getCrit,
  TAUNT_TYPES,
  BOT_TYPES,
  shuffle,
  BOT_HANDICAPS,
} = require("./CONST");

class Game {
  constructor({ guildId, speed, test, channelId }) {
    console.log("NEW GAME", guildId, speed);

    this.guildId = guildId;
    this.speed = speed;
    this.test = test;
    this.channelId = channelId;

    this.players = {};
    this.agents = {};

    this.gameInterval = null;

    this.gameStatus = GAME_STATUS.CREATED;
    this.winner = null;
  }

  gameStep() {
    Object.values(this.players).forEach((player) => {
      if (player.stamina < MAX_STAMINA) {
        player.stamina += 1;
      }
    });

    if (this.gameStatus === GAME_STATUS.STARTED) {
      this.doBotActions();
    }

    this.checkGameOver();
  }

  doBotActions() {
    let botResponse = "";
    Object.values(this.players)
      .filter((player) => player.bot && player.bot !== BOT_TYPES.AFK)
      .filter((player) => player.stamina > 0)
      .filter((player) => player.hp > 0)
      .forEach((player) => {
        botResponse += getBotAction({ player, game: this });
      });
    if (this.channelId && botResponse) {
      global.engine.client.channels.cache.get(this.channelId).send(botResponse);
    }
  }

  setIntervals() {
    this.gameInterval = setInterval(() => {
      this.gameStep();
    }, this.getDurationMs(1));
  }

  clearIntervals() {
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

  gameJoin({ playerId, ...playerProps }) {
    this.players[playerId] = new Player({ playerId, ...playerProps });
  }

  getTarget({ playerId }) {
    const newTargetId = shuffle(
      Object.keys(this.players)
        .filter((_playerId) => _playerId !== playerId)
        .filter((playerId) => this.players[playerId].hp > 0)
    )[0];
    return newTargetId ? newTargetId : playerId;
  }

  getDuration(duration) {
    return (duration * SPEED_MAP[this.speed]) / 1000;
  }

  getDurationMs(duration) {
    return duration * SPEED_MAP[this.speed];
  }

  getGameStatus() {
    let response = ``;
    const playersString = Object.values(this.players).reduce((acc, player) => {
      let statusString = `${acc}\n\n${player.name}:`;
      statusString += `\thp ${player.hp},  `;
      if (player.hp < 0) return statusString;
      statusString += `\tstamina: (${this.getDuration(player.stamina)}s), `;
      if (player.staminaDamage)
        statusString += `\tstaminaDamage: ${player.staminaDamage}`;
      if (player.legDamage) statusString += `\tlegDamage: ${player.legDamage}`;
      if (player.grapple) statusString += `\tgrapple level: ${player.grapple}`;
      if (player.rage) statusString += `\trage: ${player.rage}`;
      if (player.weak) statusString += `\tweak: ${player.weak}`;
      return statusString;
    }, "");
    response += playersString;
    return response;
  }

  checkGameOver() {
    let activePlayers = 0;
    let activePlayer = "no one";

    Object.values(this.players).forEach((player) => {
      if (player.hp > 0) {
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
      return `${this.players[targetId].name} blocked 🛡️ the grapple`;
    }

    this.players[targetId].grapple = Math.min(
      GRAPPLE_LIMIT,
      this.players[targetId].grapple + 1
    );

    let actionResponse = "";
    actionResponse += this.players[playerId].name;
    actionResponse += ` grappled (${position}) `;
    actionResponse += this.players[targetId].name;
    actionResponse += ` (grapple ${this.players[targetId].grapple})`;

    if (this.players[targetId].grapple >= GRAPPLE_LIMIT) {
      actionResponse += `\n${this.damagePlayer({
        targetId,
        damage: GRAPPLE_DAMAGE,
        playerId,
      })}`;
    }

    return actionResponse;
  }

  damagePlayer({ playerId, targetId, damage, crit = false }) {
    let _damage = damage;
    let blocked = "";

    if (this.players[playerId].rage) {
      blocked = ` (rage ${this.players[playerId].rage} 🤬)`;
      _damage = _damage + this.players[playerId].rage;
      this.players[playerId].rage = 0;
    }
    if (this.players[playerId].weak) {
      blocked = ` (weak ${this.players[playerId].weak} 🥶)`;
      _damage = Math.max(0, _damage - this.players[playerId].weak);
      this.players[playerId].weak = 0;
    }
    if (this.players[playerId].grapple) {
      blocked += ` (grappled ${this.players[playerId].grapple} 🫳)`;
      _damage = Math.max(0, _damage - this.players[playerId].grapple);
    }
    if (crit) {
      _damage = _damage * 2;
    }
    if (this.players[targetId].guard) {
      blocked = " (blocked 🛡️)";
      _damage = _damage / 2;
    }

    this.players[targetId].hp -= _damage;

    const damageString = `${this.players[targetId].name} took ${_damage} damage${blocked}`;

    if (this.players[targetId].hp <= 0) {
      const gameOverResponse = this.checkGameOver();
      return `${damageString}\n${this.players[targetId].name} was disabled!${gameOverResponse}`;
    }

    return damageString;
  }

  staminaDamagePlayer({ targetId, damage }) {
    let _damage = damage;
    let blocked = "";

    if (this.players[targetId].guard) {
      blocked = " (blocked 🛡️)";
      _damage = _damage / 2;
    }

    this.players[targetId].staminaDamage += _damage;

    return `${this.players[targetId].name} took (${this.getDuration(
      _damage
    )}s) stamina damage${blocked}`;
  }

  legDamagePlayer({ targetId, damage }) {
    let _damage = damage;
    let blocked = "";

    if (this.players[targetId].guard) {
      blocked = " (blocked 🛡️)";
      _damage = _damage / 2;
    }

    this.players[targetId].legDamage += _damage;

    if (this.players[targetId].legDamage >= LEG_DAMAGE_THRESHOLD_MAX) {
      return `${this.players[targetId].name} legs were severely injured!`;
    }
    if (this.players[targetId].legDamage >= LEG_DAMAGE_THRESHOLD) {
      return `${this.players[targetId].name} legs were injured!`;
    }
    return `${this.players[targetId].name} took ${_damage} leg damage${blocked}`;
  }

  payActionCost({ playerId, cost }) {
    let adjustedCost = cost;
    let infoString = "";

    if (this.players[playerId].staminaDamage) {
      adjustedCost += this.players[playerId].staminaDamage;
      infoString += ` (stamina damage ${this.getDuration(
        this.players[playerId].staminaDamage
      )}s)`;
    }

    if (this.players[playerId].grapple) {
      infoString += ` (grappled ${this.getDuration(
        this.players[playerId].grapple * 2
      )}s)`;
      adjustedCost += this.players[playerId].grapple * 2;
    }

    if (this.players[playerId].legDamage >= LEG_DAMAGE_THRESHOLD_MAX) {
      adjustedCost += adjustedCost * 2;
      infoString += " (leg injured x2)";
    } else if (this.players[playerId].legDamage >= LEG_DAMAGE_THRESHOLD) {
      adjustedCost += adjustedCost * 1.5;
      infoString += " (leg injured x1.5)";
    }

    if (this.players[playerId].bot) {
      adjustedCost += BOT_HANDICAPS[this.players[playerId].bot];
    }

    this.players[playerId].stamina =
      this.players[playerId].stamina - adjustedCost;
    this.players[playerId].staminaDamage = 0;

    const costResponse = `${
      this.players[playerId].name
    } used (${this.getDuration(adjustedCost)}s) stamina${
      adjustedCost === cost ? "" : ` ${infoString}`
    }`;

    return costResponse;
  }

  getActionResponse(responses) {
    let content = "";
    responses.forEach((response) => {
      if (response.length) content += `\n${response}`;
    });
    return content;
  }

  doAction({
    playerId,
    targetId: maybeTargetId,
    position,
    actionId,
    useTarget,
  }) {
    // get a random target if we don't have one
    let targetId = useTarget ? maybeTargetId : "";
    if (useTarget && !this.players[maybeTargetId]) {
      targetId = this.getTarget({ playerId });
    }

    const { cost, damage, name, props } = ACTIONS[actionId];
    // console.log("actionData", { actionId, cost, damage, props });

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
      preventAction = `${this.players[targetId].name} dodged 🏃 the attack (${name} ${position})`;
    }

    if (
      props.counterable &&
      this.players[targetId].counter &&
      this.players[targetId].counter === POSITION_MAP[position]
    ) {
      const crit = getCrit();
      preventAction = `${this.players[targetId].name} countered ↪️ the attack (${actionId} ${position})`;
      if (crit) preventAction += "\ncritical hit!";
      preventAction += `\n${this.damagePlayer({
        playerId: targetId,
        targetId: playerId,
        damage: COUNTER_DAMAGE,
        crit,
      })}`;
    }

    if (preventAction) {
      return {
        response: {
          content: this.getActionResponse([costResponse, preventAction]),
          ephemeral: false,
        },
        followUp,
        gameSpeedModifier: SPEED_MAP[this.speed],
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
      ? this.damagePlayer({ targetId, damage, crit, playerId })
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
      gameSpeedModifier: SPEED_MAP[this.speed],
    };
  }

  punch({ playerId, targetId, position, props }) {
    let specialResponse = "";
    let actionResponse = "👊 ";
    let crit = false;

    const { staminaRecovery, staminaDamage } = props;

    switch (position) {
      case PUNCH_TYPES.Jab:
        this.players[playerId].stamina += staminaRecovery;
        specialResponse = `(${this.getDuration(
          staminaRecovery
        )}s) stamina recovered`;
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
    let actionResponse = "🦵 ";
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
    let actionResponse = "🫳 ";
    let crit = false;

    const { staminaDamage, staminaRecovery, throwDamage, legDamage } = props;

    switch (position) {
      case GRAPPLE_TYPES.Trip:
        this.players[playerId].stamina += staminaRecovery;
        specialResponse = `(${this.getDuration(
          staminaRecovery
        )}s) stamina recovered`;
        specialResponse += `\n${this.legDamagePlayer({
          targetId,
          damage: legDamage,
        })}`;
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
        specialResponse += `${this.damagePlayer({
          targetId,
          damage: throwDamage,
          crit,
          playerId,
        })}`;
        break;
      default:
    }

    actionResponse += this.grapplePlayer({ targetId, playerId, position });

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit,
    };
  }

  dodge({ playerId, position, props }) {
    let specialResponse = "";
    let actionResponse = "🏃 ";

    const { duration } = props;

    actionResponse += this.players[playerId].name;
    actionResponse += ` is evading attacks (${this.getDuration(duration)}s)`;

    this.players[playerId].dodge = position;
    setTimeout(() => {
      this.players[playerId].dodge = null;
    }, this.getDurationMs(duration));

    return {
      ephemeral: true,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }

  counter({ playerId, position, props }) {
    let specialResponse = "";
    let actionResponse = "↪️ ";

    const { duration } = props;

    actionResponse += this.players[playerId].name;
    actionResponse += ` is preparing to counter ${position} (${this.getDuration(
      duration
    )}s)`;

    this.players[playerId].counter = position;
    setTimeout(() => {
      this.players[playerId].counter = null;
    }, this.getDurationMs(duration));

    return {
      ephemeral: true,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }

  guard({ playerId, props, position }) {
    let specialResponse = "";
    let actionResponse = "🛡️ ";

    const { duration, staminaRecovery, healthRecovery } = props;

    switch (position) {
      case GUARD_TYPES.Quick:
        this.players[playerId].stamina += staminaRecovery;
        specialResponse = `(${this.getDuration(
          staminaRecovery
        )}s) stamina recovered`;
        break;
      case GUARD_TYPES.Recover:
        if (this.players[playerId].hp < MAX_HP)
          specialResponse = `${healthRecovery} health recovered`;
        if (
          this.players[playerId].hp < MAX_HP &&
          this.players[playerId].legDamage
        )
          specialResponse += "\n";
        if (this.players[playerId].legDamage)
          specialResponse += `${healthRecovery} leg health recovered`;
        this.players[playerId].hp = Math.min(
          this.players[playerId].hp + healthRecovery,
          MAX_HP
        );
        this.players[playerId].legDamage = Math.max(
          this.players[playerId].legDamage - healthRecovery,
          0
        );
        break;
      case GUARD_TYPES.Grapple:
        if (this.players[playerId].grapple) {
          specialResponse = `reduced grapple level to ${
            this.players[playerId].grapple - 1
          }`;
          this.players[playerId].grapple = Math.max(
            0,
            this.players[playerId].grapple - 1
          );
        }
        break;
      default:
    }

    this.players[playerId].guard = position;
    setTimeout(() => {
      this.players[playerId].guard = null;
    }, this.getDurationMs(duration));

    actionResponse += this.players[playerId].name;
    actionResponse += ` is guarding attacks (${this.getDuration(duration)}s)`;

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }

  taunt({ playerId, props, position }) {
    const enraged = this.players[playerId].hp <= 5;

    let actionResponse = "";
    let specialResponse = "";

    const { throwDamage } = props;

    switch (position) {
      case TAUNT_TYPES.Distract:
        actionResponse = `🥶${enraged ? "🥶" : ""} `;
        Object.values(this.players)
          .filter((player) => player.id !== playerId)
          .forEach((player, index) => {
            this.players[player.id].weak += enraged ? 2 : 1;
            specialResponse += `${index > 0 ? "\n" : ""}${
              this.players[player.id].name
            } was weakened${enraged ? " (x2)" : ""}`;
          });
        break;
      case TAUNT_TYPES.Rage:
        actionResponse = `🤬${enraged ? "🤬" : ""} `;
        this.players[playerId].rage += enraged ? 2 : 1;
        break;
      case TAUNT_TYPES.Throw:
        actionResponse = `💥${enraged ? "💥" : ""} `;

        // handle modifiers for aoe attack
        let _throwDamage = throwDamage;
        if (this.players[playerId].rage) {
          _throwDamage += this.players[playerId].rage;
          this.players[playerId].rage = 0;
          specialResponse += "(rage 🤬)\n";
        }
        if (this.players[playerId].weak) {
          _throwDamage -= this.players[playerId].weak;
          this.players[playerId].weak = 0;
          specialResponse += "(weak 🥶)\n";
        }

        Object.values(this.players)
          .filter((player) => player.id !== playerId)
          .forEach((player, index) => {
            specialResponse += `${index > 0 ? "\n" : ""}${this.damagePlayer({
              targetId: player.id,
              damage: enraged ? _throwDamage * 2 : _throwDamage,
              crit: false,
              playerId,
            })}`;
          });
        break;
      default:
    }

    actionResponse += `${this.players[playerId].name} used taunt (${position})`;

    return {
      ephemeral: false,
      actionResponse,
      specialResponse,
      crit: false,
    };
  }
}

module.exports = Game;
