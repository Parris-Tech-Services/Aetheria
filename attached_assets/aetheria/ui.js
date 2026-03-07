function renderGame() {
    const grid = document.getElementById('grid');
    const map = Maps[gameState.currentMap];
    document.getElementById('location-name').innerText = map.name;
    grid.innerHTML = '';

    map.layout.forEach((row, y) => {
        row.split('').forEach((char, x) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (char === '#') tile.classList.add('tile-wall');
            else tile.classList.add('tile-grass');

            if (x === gameState.player.x && y === gameState.player.y) {
                tile.innerText = '🛡️';
                tile.classList.add('player');
            } else if (Entities[char]) {
                tile.innerText = Entities[char].sprite;
            } else if (char === '>' || char === '<') {
                tile.innerText = '🚪';
            }
            grid.appendChild(tile);
        });
    });
    updateStatsUI();
}

function updateStatsUI() {
    const p = gameState.player;
    document.getElementById('p-hp').innerText = p.hp;
    document.getElementById('p-maxhp').innerText = p.maxHp;
    document.getElementById('p-hp-fill').style.width = (p.hp / p.maxHp * 100) + '%';
    document.getElementById('p-gold').innerText = p.gold;
    
    // Action Indicators
    document.getElementById('indicator-action').className = p.actions > 0 ? 'token' : 'token used';
    document.getElementById('indicator-bonus').className = p.bonusActions > 0 ? 'token' : 'token used';
}

function handleEncounter(char, x, y) {
    const entity = Entities[char];
    const ui = document.getElementById('interaction-ui');
    const log = document.getElementById('log-window');
    const actions = document.getElementById('action-bar');
    
    ui.classList.remove('hidden');
    document.getElementById('action-economy').classList.remove('hidden');
    document.getElementById('ui-title').innerText = entity.name;
    log.innerHTML = `You encounter a ${entity.name}.`;
    actions.innerHTML = '';

    if (entity.type === 'enemy') {
        startCombat(entity, log, actions, x, y);
    } else {
        createButton(actions, 'Talk', () => { log.innerHTML += '<br>"Greetings, traveler."'; });
        createButton(actions, 'Leave', () => { ui.classList.add('hidden'); });
    }
}

function createButton(container, text, fn, isBonus = false) {
    const b = document.createElement('button');
    b.innerText = text;
    b.onclick = () => {
        fn();
        updateStatsUI();
    };
    container.appendChild(b);
}

function startCombat(enemy, log, container, ex, ey) {
    gameState.player.actions = 1;
    gameState.player.bonusActions = 1;
    
    const refresh = () => {
        container.innerHTML = '';
        // Action: Attack
        const atkBtn = document.createElement('button');
        atkBtn.innerText = '⚔️ Attack (Action)';
        atkBtn.disabled = gameState.player.actions <= 0;
        atkBtn.onclick = () => {
            gameState.player.actions--;
            const roll = rollD20(gameState.player.str);
            if (roll >= enemy.ac) {
                const dmg = Math.floor(Math.random() * 8) + 1 + gameState.player.str;
                enemy.hp -= dmg;
                log.innerHTML += `<br>You hit for ${dmg} damage! (Rolled ${roll})`;
                triggerJuice('shake');
            } else {
                log.innerHTML += `<br>You missed! (Rolled ${roll})`;
            }
            if (enemy.hp <= 0) {
                alert('Victory!');
                Maps[gameState.currentMap].layout[ey] = Maps[gameState.currentMap].layout[ey].replace(enemy.sprite, ' ');
                location.reload(); // Simple way to clear map data for this demo
            }
            refresh();
        };
        container.appendChild(atkBtn);

        // Bonus Action: Second Wind
        const healBtn = document.createElement('button');
        healBtn.innerText = '🧪 Second Wind (Bonus)';
        healBtn.disabled = gameState.player.bonusActions <= 0;
        healBtn.onclick = () => {
            gameState.player.bonusActions--;
            const heal = Math.floor(Math.random() * 10) + 1 + gameState.player.level;
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + heal);
            log.innerHTML += `<br>You use Second Wind and heal ${heal} HP!`;
            refresh();
        };
        container.appendChild(healBtn);

        createButton(container, 'End Turn', () => {
            // Enemy Turn Logic
            const eRoll = rollD20(enemy.atk);
            if (eRoll >= gameState.player.ac) {
                const eDmg = Math.floor(Math.random() * enemy.dmg) + 1;
                gameState.player.hp -= eDmg;
                log.innerHTML += `<br><span style='color:red'>Enemy hits for ${eDmg} damage!</span>`;
                triggerJuice('shake');
            } else { log.innerHTML += '<br>Enemy misses!'; }
            gameState.player.actions = 1;
            gameState.player.bonusActions = 1;
            refresh();
        });
    };
    refresh();
}

function triggerJuice(effect) {
    const container = document.getElementById('game-container');
    container.classList.add(effect);
    setTimeout(() => container.classList.remove(effect), 300);
}

renderGame();