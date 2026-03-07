// Encounter handlers
const Encounters = (() => {
  function route(entity, log, buttons, state) {
    switch (entity.encounter) {
      case 'guardToll': return guardToll(entity, log, buttons, state);
      case 'slimeCombat': return slimeCombat(entity, log, buttons, state);
      case 'oldChest': return oldChest(entity, log, buttons, state);
      case 'forestHermit': return forestHermit(entity, log, buttons, state);
      default:
        log.innerText = 'Nothing happens.';
        Game.createButton(buttons, 'Leave', Game.endInteraction);
    }
  }

  function guardToll(entity, log, buttons, state) {
    log.innerHTML = 'The guard blocks the path. "Road's closed. Toll is 5 gold, or turn back."';

    Game.createButton(buttons, 'Pay 5 Gold', () => {
      if (state.player.gold >= 5) {
        state.player.gold -= 5;
        Game.removeEntityFromMap(state.currentEncounter.x, state.currentEncounter.y);
        alert('You pay the toll. He steps aside.');
        Game.endInteraction();
      } else {
        log.innerHTML += '<br><b>You don't have enough gold!</b>';
      }
    });

    Game.createButton(buttons, '[Persuasion] Official Business', () => {
      const check = Game.abilityCheck(state.player.cha, 13);
      if (check.success) {
        Game.addLore('guard_respects_authority');
        Game.removeEntityFromMap(state.currentEncounter.x, state.currentEncounter.y);
        alert(`Success! (${check.total}) "Forgive me, pass on through."`);
        Game.endInteraction();
      } else {
        log.innerHTML += `<br><span class="check-fail">Fail! (${check.total})</span> "Nice story. Pay up."`;
      }
    });

    Game.createButton(buttons, 'Ask about woods', () => {
      log.innerHTML = '"Folk go in chasing voices and don't come out," he mutters. "The trees remember the old war."';
      Game.addLore('whispering_woods_rumor_1');
    });

    Game.createButton(buttons, 'Leave', Game.endInteraction);
  }

  function slimeCombat(entity, log, buttons, state) {
    log.innerHTML = 'A quivering slime oozes toward you!';

    function refreshButtons() {
      buttons.innerHTML = '';
      Game.createButton(buttons, 'Attack (1d10+STR)', () => {
        const atk = Game.attackRoll(state.player.str + 2, entity.ac);
        if (atk.hit) {
          const dmg = Math.floor(Math.random() * 10) + 1 + state.player.str;
          entity.currentHp -= dmg;
          log.innerHTML += `<br>You hit for ${dmg} damage!`;
          if (entity.currentHp <= 0) {
            state.player.gold += 5;
            Game.removeEntityFromMap(state.currentEncounter.x, state.currentEncounter.y);
            alert('Slime defeated! You find 5 gold.');
            Game.endInteraction();
            return;
          }
        } else {
          log.innerHTML += `<br>You miss! (Rolled ${atk.total})`;
        }
        slimeTurn();
      });

      Game.createButton(buttons, 'Dodge', () => {
        log.innerHTML += '<br>You prepare to dodge.';
        slimeTurn(true);
      });

      Game.createButton(buttons, 'Run Away', Game.endInteraction);
    }

    function slimeTurn(playerDodging) {
      let slimeAtk = Game.attackRoll(entity.attackMod, state.player.ac);
      if (playerDodging) {
        let second = Game.attackRoll(entity.attackMod, state.player.ac);
        if (second.total < slimeAtk.total) slimeAtk = second;
      }

      if (slimeAtk.hit) {
        const dmg = Math.floor(Math.random() * entity.damageDie) + 1;
        state.player.hp -= dmg;
        log.innerHTML += `<br><span style="color:red">Slime hits you for ${dmg} acid damage!</span>`;
        if (state.player.hp <= 0) {
          alert('YOU DIED');
          location.reload();
        }
      } else {
        log.innerHTML += `<br>The slime misses! (Rolled ${slimeAtk.total})`;
      }
      Game.updateStats();
      log.scrollTop = log.scrollHeight;
    }

    refreshButtons();
  }

  function oldChest(entity, log, buttons, state) {
    log.innerHTML = 'An old iron-bound chest sits in the roots.';

    Game.createButton(buttons, '[Investigation] Inspect', () => {
      const check = Game.abilityCheck(state.player.int, 10);
      log.innerHTML += check.success
        ? '<br>You notice faint runes. It's trapped!'
        : '<br>It looks like a normal old chest.';
    });

    Game.createButton(buttons, '[Athletics] Kick it open', () => {
      const check = Game.abilityCheck(state.player.str, 15);
      if (check.success) {
        state.player.gold += 20;
        Game.removeEntityFromMap(state.currentEncounter.x, state.currentEncounter.y);
        alert('SUCCESS! You find 20 gold!');
        Game.endInteraction();
      } else {
        const dmg = Math.floor(Math.random() * 4) + 1;
        state.player.hp -= dmg;
        log.innerHTML += `<br><span class="check-fail">The chest is sturdy! You take ${dmg} dmg kicking it.</span>`;
        Game.updateStats();
      }
    });

    Game.createButton(buttons, 'Leave', Game.endInteraction);
  }

  function forestHermit(entity, log, buttons, state) {
    log.innerHTML = 'An old hermit leans on a staff. "Another soul chasing whispers?"';

    Game.createButton(buttons, 'Ask about whispers', () => {
      if (Game.hasLore('whispering_woods_rumor_1')) {
        log.innerHTML = '"The guard knows fear, but the trees know names," he whispers. "Your name, perhaps."';
        Game.addLore('hermit_warning');
      } else {
        log.innerHTML = '"The woods speak to those who listen," he says. "Sometimes they even answer."';
        Game.addLore('whispering_woods_rumor_2');
      }
    });

    Game.createButton(buttons, 'Offer 2 gold for healing', () => {
      if (state.player.gold >= 2) {
        state.player.gold -= 2;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 8);
        log.innerHTML = 'He blesses you. You feel restored! (+8 HP)';
        Game.updateStats();
      } else {
        log.innerHTML = '"I cannot eat air, traveler."';
      }
    });

    Game.createButton(buttons, 'Leave', Game.endInteraction);
  }

  return { route };
})();
