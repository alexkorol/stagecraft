// Grid Configuration
export const GRID_SIZE = 8;
export const CELL_SIZE = 50;
export const SPRITE_GRID_SIZE = 8;

// Colors
export const COLORS = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080'  // Purple
];

// Rule Types
export const RULE_TYPES = {
    MOVE: 'move',
    JUMP: 'jump',
    TURN: 'turn'
};

// Directions
export const DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down'
};

// Simulation Settings
export const SIMULATION_SPEEDS = {
    SLOW: 2000,
    NORMAL: 1000,
    FAST: 500,
    VERY_FAST: 250
};

// Default Project Settings
export const DEFAULT_PROJECT = {
    gridSize: GRID_SIZE,
    settings: {
        showGrid: true,
        snapToGrid: true,
        autoSave: true
    }
};

// Toast Settings
export const TOAST_DURATION = 3000;
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Storage Keys
export const STORAGE_KEYS = {
    PROJECTS: 'stagecraft_projects',
    CURRENT_PROJECT: 'stagecraft_current_project',
    SETTINGS: 'stagecraft_settings',
    TUTORIAL_COMPLETED: 'tutorial_completed'
};

// Event Types
export const EVENTS = {
    CHARACTER_MOVED: 'characterMoved',
    RULE_EXECUTED: 'ruleExecuted',
    SIMULATION_STARTED: 'simulationStarted',
    SIMULATION_STOPPED: 'simulationStopped'
};

// Character Properties
export const CHARACTER_DEFAULTS = {
    sprite: Array(SPRITE_GRID_SIZE).fill().map(() => Array(SPRITE_GRID_SIZE).fill('#FFFFFF')),
    x: -1,
    y: -1,
    direction: DIRECTIONS.RIGHT
};

// Tool Types
export const TOOLS = {
    PENCIL: 'pencil',
    FILL: 'fill',
    ERASER: 'eraser'
};

// Theme Colors
export const THEME = {
    light: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB'
    },
    dark: {
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        background: '#1F2937',
        text: '#F3F4F6',
        border: '#374151'
    }
};

export default {
    GRID_SIZE,
    CELL_SIZE,
    SPRITE_GRID_SIZE,
    COLORS,
    RULE_TYPES,
    DIRECTIONS,
    SIMULATION_SPEEDS,
    DEFAULT_PROJECT,
    TOAST_DURATION,
    TOAST_TYPES,
    STORAGE_KEYS,
    EVENTS,
    CHARACTER_DEFAULTS,
    TOOLS,
    THEME
};
