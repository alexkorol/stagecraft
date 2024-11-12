export const TRIGGERS = {
    ALWAYS: 'always',
    KEY_PRESS: 'keyPress',
    COLLISION: 'collision',
    PROXIMITY: 'proximity',
    TIMER: 'timer',
    CLICK: 'click'
};

export const DIRECTIONS = {
    NONE: 'none',
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

export const GRID_SIZES = {
    SMALL: { width: 8, height: 8 },
    MEDIUM: { width: 16, height: 16 },
    LARGE: { width: 32, height: 32 }
};

export const SPRITE_SIZES = {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 32,
    XLARGE: 64
};

export const DEFAULT_COLORS = [
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
    '#808080', // Gray
    '#C0C0C0', // Silver
    '#800000', // Maroon
    '#808000', // Olive
    '#008000', // Dark Green
    '#800080', // Purple
    '#008080', // Teal
    '#000080'  // Navy
];

export const TOOLS = {
    PENCIL: 'pencil',
    LINE: 'line',
    RECT: 'rectangle',
    CIRCLE: 'circle',
    FILL: 'fill',
    ERASER: 'eraser'
};

export const ANIMATION_SPEEDS = {
    VERY_SLOW: 2000,
    SLOW: 1000,
    NORMAL: 500,
    FAST: 250,
    VERY_FAST: 100
};

export const KEY_BINDINGS = {
    UNDO: 'ctrl+z',
    REDO: 'ctrl+y',
    SAVE: 'ctrl+s',
    NEW_CHARACTER: 'ctrl+n',
    DELETE: 'delete',
    PLAY_PAUSE: 'space',
    STEP: 'right',
    RESET: 'r'
};

export const LOCAL_STORAGE_KEYS = {
    PROJECT: 'stagecraft_project',
    SETTINGS: 'stagecraft_settings',
    RECENT_PROJECTS: 'stagecraft_recent_projects'
};

export const MAX_RECENT_PROJECTS = 10;
export const MAX_UNDO_STEPS = 50;
export const DEFAULT_GRID_SIZE = GRID_SIZES.SMALL;
export const DEFAULT_SPRITE_SIZE = SPRITE_SIZES.MEDIUM;
export const DEFAULT_ANIMATION_SPEED = ANIMATION_SPEEDS.NORMAL;

export const FILE_TYPES = {
    PROJECT: '.scp',  // StageCraft Project
    SPRITE: '.scs',   // StageCraft Sprite
    RULE: '.scr'      // StageCraft Rule
};

export const ERROR_MESSAGES = {
    INVALID_FILE: 'Invalid file format',
    SAVE_FAILED: 'Failed to save project',
    LOAD_FAILED: 'Failed to load project',
    RULE_VALIDATION: 'Invalid rule configuration',
    GRID_BOUNDS: 'Position out of grid bounds',
    CHARACTER_EXISTS: 'Character already exists at position'
};