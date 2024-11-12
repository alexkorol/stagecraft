class CollisionManager {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.collisionMap = new Map();
        this.interactionCallbacks = new Map();
    }

    // Update the collision map with current character positions
    updateCollisionMap(characters) {
        this.collisionMap.clear();
        
        characters.forEach(char => {
            if (char.x >= 0 && char.x < this.gridSize && 
                char.y >= 0 && char.y < this.gridSize &&
                char.isVisible !== false) {
                const key = `${char.x},${char.y}`;
                if (!this.collisionMap.has(key)) {
                    this.collisionMap.set(key, []);
                }
                this.collisionMap.get(key).push(char);
            }
        });
    }

    // Check if a position is occupied
    isOccupied(x, y) {
        const key = `${x},${y}`;
        return this.collisionMap.has(key) && this.collisionMap.get(key).length > 0;
    }

    // Get characters at a specific position
    getCharactersAt(x, y) {
        const key = `${x},${y}`;
        return this.collisionMap.get(key) || [];
    }

    // Register interaction callback for character types
    registerInteraction(type1, type2, callback) {
        const key = `${type1}-${type2}`;
        this.interactionCallbacks.set(key, callback);
    }

    // Check and handle collisions for all characters
    checkCollisions(characters) {
        const collisions = [];
        
        this.collisionMap.forEach((chars, position) => {
            if (chars.length > 1) {
                // Handle multiple characters in the same cell
                for (let i = 0; i < chars.length; i++) {
                    for (let j = i + 1; j < chars.length; j++) {
                        const char1 = chars[i];
                        const char2 = chars[j];
                        
                        // Check both orderings of character types
                        const key1 = `${char1.type}-${char2.type}`;
                        const key2 = `${char2.type}-${char1.type}`;
                        
                        const callback = this.interactionCallbacks.get(key1) || 
                                       this.interactionCallbacks.get(key2);
                        
                        if (callback) {
                            collisions.push({
                                char1,
                                char2,
                                position: position.split(',').map(Number),
                                callback
                            });
                        }
                    }
                }
            }
        });

        return collisions;
    }

    // Check for adjacent characters
    getAdjacentCharacters(x, y) {
        const adjacent = {
            up: this.getCharactersAt(x, y - 1),
            down: this.getCharactersAt(x, y + 1),
            left: this.getCharactersAt(x - 1, y),
            right: this.getCharactersAt(x + 1, y)
        };

        return adjacent;
    }

    // Check if a character can move to a position
    canMoveTo(character, x, y) {
        // Check grid boundaries
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return false;
        }

        const chars = this.getCharactersAt(x, y);
        
        // If no characters, movement is allowed
        if (chars.length === 0) {
            return true;
        }

        // Check if any character blocks movement
        return !chars.some(char => char.blocksMovement);
    }

    // Get all characters within a certain range
    getCharactersInRange(x, y, range) {
        const inRange = [];
        
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const checkX = x + dx;
                const checkY = y + dy;
                
                if (checkX >= 0 && checkX < this.gridSize && 
                    checkY >= 0 && checkY < this.gridSize) {
                    const chars = this.getCharactersAt(checkX, checkY);
                    inRange.push(...chars);
                }
            }
        }

        return inRange;
    }

    // Find path between two points (simple A* implementation)
    findPath(startX, startY, endX, endY) {
        const openSet = new Set([`${startX},${startY}`]);
        const cameFrom = new Map();
        const gScore = new Map([[`${startX},${startY}`, 0]]);
        const fScore = new Map([[`${startX},${startY}`, this.heuristic(startX, startY, endX, endY)]]);

        while (openSet.size > 0) {
            let current = this.getLowestFScore(openSet, fScore);
            const [currentX, currentY] = current.split(',').map(Number);

            if (current === `${endX},${endY}`) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);

            // Check neighbors
            const neighbors = this.getValidNeighbors(currentX, currentY);
            
            for (const [nextX, nextY] of neighbors) {
                const next = `${nextX},${nextY}`;
                const tentativeGScore = gScore.get(current) + 1;

                if (!gScore.has(next) || tentativeGScore < gScore.get(next)) {
                    cameFrom.set(next, current);
                    gScore.set(next, tentativeGScore);
                    fScore.set(next, tentativeGScore + this.heuristic(nextX, nextY, endX, endY));
                    openSet.add(next);
                }
            }
        }

        return null; // No path found
    }

    // Manhattan distance heuristic
    heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    // Get valid neighboring cells
    getValidNeighbors(x, y) {
        const neighbors = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (this.canMoveTo(null, newX, newY)) {
                neighbors.push([newX, newY]);
            }
        }

        return neighbors;
    }

    // Get lowest f-score from open set
    getLowestFScore(openSet, fScore) {
        let lowest = null;
        let lowestScore = Infinity;

        for (const pos of openSet) {
            const score = fScore.get(pos);
            if (score < lowestScore) {
                lowest = pos;
                lowestScore = score;
            }
        }

        return lowest;
    }

    // Reconstruct path from cameFrom map
    reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            path.unshift(current);
        }
        return path;
    }
}

// React hook for using CollisionManager
const useCollisionManager = (gridSize) => {
    const [collisionManager] = React.useState(() => new CollisionManager(gridSize));

    const updateCollisions = React.useCallback((characters) => {
        collisionManager.updateCollisionMap(characters);
        return collisionManager.checkCollisions(characters);
    }, [collisionManager]);

    return {
        collisionManager,
        updateCollisions,
        isOccupied: collisionManager.isOccupied.bind(collisionManager),
        getCharactersAt: collisionManager.getCharactersAt.bind(collisionManager),
        registerInteraction: collisionManager.registerInteraction.bind(collisionManager),
        findPath: collisionManager.findPath.bind(collisionManager)
    };
};

export { CollisionManager, useCollisionManager };