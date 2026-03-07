// Core game engine
const Game = (() => {
  const state = {
    player: GameData.player,
    worldMap: GameData.worldMap,
    entities: GameData.entities,
    loreFlags: GameData.loreFlags,
    factionReputation: GameData.factionReputation,
    currentEncounter: null
  };

  function abilityCheck(mod, dc) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod;
    return { roll, total, success: total >= dc };
  }

  function attackRoll(attackMod, targetAC) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + attackMod;
    return { roll, total, hit: total >= targetAC };
  }

  function renderMap() {
    const view = document.getElementById('map-view');
    view.innerHTML = '';
    for (let y = 0; y < state.worldMap.length; y++) {
      for (let x = 0; x < state.worldMap[y].length; x++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        let char = state.worldMap[y][x];

        if (char === '#') tile.classList.add('tile-wall');
        else if (char === 'W') tile.classList.add('tile-water');
        else tile.classList.add('tile-grass');

        if (x === state.player.x && y === state.player.y) {
          tile.innerText = '🛡️';
          tile.classList.add('player');
        } else if (state.entities[char]) {
          tile.innerText = state.entities[char].sprite;
        }
        view.appendChild(tile);
      }
    }
  }

  function move(dx, dy) {
    const newX = state.player.x + dx;
    const newY = state.player.y + dy;
    const target = state.worldMap[newY][newX];
    if (target === '#' || target === 'W') return;
    if (state.entities[target]) {
      startInteraction(target, newX, newY);
    } else {
      state.player.x = newX;
      state.player.y = newY;
      renderMap();
    }
  }

  function startInteraction(char, x, y) {
    const entity = state.entities[char];
    state.currentEncounter = { char, x, y, entity };

    document.getElementById('map-section').style.display = 'none';
    document.getElementById('interaction-overlay').style.display = 'block';
    document.getElementById('interaction-title').innerText = entity.name;

    const log = document.getElementById('event-log');
    const buttons = document.getElementById('action-buttons');
    log.innerHTML = '';
    buttons.innerHTML = '';

    Encounters.route(entity, log, buttons, state);
  }

  function endInteraction() {
    document.getElementById('map-section').style.display = 'block';
    document.getElementById('interaction-overlay').style.display = 'none';
    updateStats();
    renderMap();
  }

  function createButton(container, text, action) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = action;
    container.appendChild(btn);
  }

  function removeEntityFromMap(x, y) {
    state.worldMap[y][x] = '.';
  }

  function addLore(key) { state.loreFlags[key] = true; }
  function hasLore(key) { return !!state.loreFlags[key]; }

  function updateStats() {
    document.getElementById('hp').innerText = state.player.hp;
    document.getElementById('gold').innerText = state.player.gold;
    document.getElementById('ac').innerText = state.player.ac;
    document.getElementById('lvl').innerText = state.player.level;
    document.getElementById('cls').innerText = state.player.cls;
  }

  function init() {
    renderMap();
    updateStats();
  }

  return {
    state,
    init,
    move,
    endInteraction,
    createButton,
    removeEntityFromMap,
    abilityCheck,
    attackRoll,
    addLore,
    hasLore,
    updateStats
  };
})();

window.addEventListener('DOMContentLoaded', () => Game.init());
