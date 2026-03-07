const Maps = {
    'village': {
        name: 'Village Edge',
        layout: [
            '##########',
            '#.@......#',
            '#..###...#',
            '#.G#T#...#',
            '#..###...#',
            '#........#',
            '#......> #',
            '##########'
        ]
    },
    'woods': {
        name: 'Whispering Woods',
        layout: [
            '##########',
            '# <      #',
            '#...S....#',
            '#........#',
            '#...S....#',
            '#........#',
            '#....W...#',
            '##########'
        ]
    }
};

const Entities = {
    'G': { name: 'Guard', type: 'npc', sprite: '💂', encounter: 'guard' },
    'S': { name: 'Slime', type: 'enemy', sprite: '💧', hp: 15, ac: 10, atk: 3, dmg: 6 },
    'T': { name: 'Chest', type: 'object', sprite: '🎁', encounter: 'chest' },
    'W': { name: 'Wolf', type: 'enemy', sprite: '🐺', hp: 12, ac: 13, atk: 4, dmg: 8 }
};