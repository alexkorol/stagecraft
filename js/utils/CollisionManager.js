import { GRID_SIZES } from '../constants';

class CollisionManager {
    constructor(gridSize = GRID_SIZES.SMALL) {
        this.gridSize = gridSize;
        this.collisionMap = new Map(); // Maps positions to characters
    }

    setGridSize(size) {
        this.gridSize = size;
    }

    // Update collision map with current character positions
    updateCollisionMap(characters) {
        this.collisionMap.clear();
        characters.forEach(char => {
            const key = this.getPositionKey(char.x, char.y);
            if (!this.collisionMap.has(key)) {
                this.collisionMap.set(key, []);
            }
            this.collisionMap.get(key).push(char);
        });
    }

    // Get position key for collision map
    getPositionKey(x, y) {
        return `${x},${y}`;
    }

    // Check if position is within grid bounds
    isInBounds(x, y) {
        return x >= 0 && x < this.gridSize.width && 
               y >= 0 && y < this.gridSize.height;
    }

    // Check if position is occupied
    isOccupied(x, y) {
        const key = this.getPositionKey(x, y);
        return this.collisionMap.has(key) && this.collisionMap.get(key).length > 0;
    }

    // Get characters at position
    getCharactersAt(x, y) {
        const key = this.getPositionKey(x, y);
        return this.collisionMap.get(key) || [];
    }

    // Check if two characters are colliding
    checkCollision(char1, char2) {
        return char1.x === char2.x && char1.y === char2.y;
    }

    // Get all characters within a certain distance of a position
    getCharactersInRange(x, y, range) {
        const characters = [];
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const checkX = x + dx;
                const checkY = y + dy;
                if (this.isInBounds(checkX, checkY)) {
                    const chars = this.getCharactersAt(checkX, checkY);
                    characters.push(...chars);
                }
            }
        }
        return characters;
    }

    // Check if a move is valid
    isValidMove(character, newX, newY) {
        // Check bounds
        if (!this.isInBounds(newX, newY)) {
            return false;
        }

        // Check collisions (if character doesn't allow overlap)
        if (!character.allowOverlap) {
            const occupants = this.getCharactersAt(newX, newY);
            if (occupants.length > 0 && !occupants.every(c => c.id === character.id)) {
                return false;
            }
        }

        return true;
    }

    // Get all collisions in the current state
    getAllCollisions() {
        const collisions = [];
        this.collisionMap.forEach((characters, position) => {
            if (characters.length > 1) {
                collisions.push({
                    position: position.split(',').map(Number),
                    characters: characters
                });
            }
        });
        return collisions;
    }

    // Check if a character can see another character (line of sight)
    hasLineOfSight(char1, char2, maxDistance = Infinity) {
        const dx = Math.abs(char2.x - char1.x);
        const dy = Math.abs(char2.y - char1.y);
        
        // Check distance
        if (Math.max(dx, dy) > maxDistance) {
            return false;
        }

        // Bresenham's line algorithm
        const sx = char1.x < char2.x ? 1 : -1;
        const sy = char1.y < char2.y ? 1 : -1;
        let err = dx - dy;
        let x = char1.x;
        let y = char1.y;

        while (true) {
            if (x === char2.x && y === char2.y) {
                return true;
            }

            // Check for obstacles (characters marked as solid)
            const chars = this.getCharactersAt(x, y);
            if (chars.some(c => c.isSolid && c.id !== char1.id && c.id !== char2.id)) {
                return false;
            }

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }

    // Get possible moves for a character
    getPossibleMoves(character) {
        const moves = [];
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }   // right
        ];

        directions.forEach(({ dx, dy }) => {
            const newX = character.x + dx;
            const newY = character.y + dy;
            if (this.isValidMove(character, newX, newY)) {
                moves.push({ x: newX, y: newY });
            }
        });

        return moves;
    }
}

export default CollisionManager;
