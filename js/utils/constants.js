const GRID_SIZE = 8;
const CELL_SIZE = 50;
const SPRITE_GRID_SIZE = 8;
const COLORS = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#A52A2A', // Brown
    '#808080', // Gray
];

const RULE_TYPES = {
    MOVE: 'move',
    JUMP: 'jump',
    TURN: 'turn',
    CHANGE_SPRITE: 'change_sprite',
    DISAPPEAR: 'disappear',
    APPEAR: 'appear',
};

const DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down',
};

const CONDITIONS = {
    EMPTY_CELL: 'empty_cell',
    HAS_CHARACTER: 'has_character',
    SPECIFIC_CHARACTER: 'specific_character',
    KEY_PRESSED: 'key_pressed',
    MOUSE_CLICK: 'mouse_click',
    TIMER: 'timer',
};

export {
    GRID_SIZE,
    CELL_SIZE,
    SPRITE_GRID_SIZE,
    COLORS,
    RULE_TYPES,
    DIRECTIONS,
    CONDITIONS,
};