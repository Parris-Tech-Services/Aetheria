let gameState = {
    player: {
        x: 1, y: 1, hp: 30, maxHp: 30, gold: 10, ac: 16,
        str: 3, dex: 2, cha: 2,
        actions: 1, bonusActions: 1,
        conditions: [], quests: []
    },
    currentMap: 'village',
    inCombat: false
};

function rollD20(mod = 0) {
    return Math.floor(Math.random() * 20) + 1 + mod;
}

function movePlayer(dx, dy) {
    if (gameState.inCombat) return;
    
    let newX = gameState.player.x + dx;
    let newY = gameState.player.y + dy;
    let row = Maps[gameState.currentMap].layout[newY];
    if (!row) return;
    let tile = row[newX];

    if (tile === '#' ) return;
    
    // Transitions
    if (tile === '>') { switchMap('woods', 1, 1); return; }
    if (tile === '<') { switchMap('village', 7, 6); return; }

    if (Entities[tile]) {
        handleEncounter(tile, newX, newY);
    } else {
        gameState.player.x = newX;
        gameState.player.y = newY;
        renderGame();
    }
}

function switchMap(key, startX, startY) {
    gameState.currentMap = key;
    gameState.player.x = startX;
    gameState.player.y = startY;
    renderGame();
}

window.addEventListener('keydown', e => {
    if (document.getElementById('interaction-ui').classList.contains('hidden')) {
        if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -1);
        if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
        if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-1, 0);
        if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
    }
});