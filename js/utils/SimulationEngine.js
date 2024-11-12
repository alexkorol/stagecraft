class SimulationEngine {
    constructor(project, onUpdate) {
        this.project = project;
        this.onUpdate = onUpdate;
        this.isRunning = false;
        this.simulationSpeed = 1000; // Default 1 second interval
        this.intervalId = null;
        this.frameCount = 0;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.executeFrame();
        }, this.simulationSpeed);
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    setSpeed(speed) {
        this.simulationSpeed = speed;
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }

    executeFrame() {
        this.frameCount++;
        const updatedCharacters = [...this.project.characters];
        let hasChanges = false;

        // Process each character's rules
        updatedCharacters.forEach(char => {
            const applicableRules = this.findApplicableRules(char);
            
            for (const rule of applicableRules) {
                const changes = this.applyRule(char, rule);
                if (changes) {
                    Object.assign(char, changes);
                    hasChanges = true;
                    break; // Only apply first matching rule
                }
            }
        });

        if (hasChanges) {
            const updatedProject = {
                ...this.project,
                characters: updatedCharacters
            };
            this.project = updatedProject;
            this.onUpdate(updatedProject);
        }
    }

    findApplicableRules(character) {
        return this.project.rules
            .filter(rule => rule.characterId === character.id)
            .filter(rule => this.checkRuleConditions(character, rule));
    }

    checkRuleConditions(character, rule) {
        if (!rule.conditions || rule.conditions.length === 0) {
            return true;
        }

        return rule.conditions.every(condition => {
            switch (condition.type) {
                case 'empty_cell':
                    return this.checkEmptyCell(character, condition.direction);
                case 'has_character':
                    return this.checkHasCharacter(character, condition.direction);
                case 'key_pressed':
                    return this.checkKeyPressed(condition.key);
                case 'timer':
                    return this.frameCount % condition.interval === 0;
                default:
                    return false;
            }
        });
    }

    checkEmptyCell(character, direction) {
        const { x: newX, y: newY } = this.getNewPosition(character, direction);
        return this.isCellEmpty(newX, newY);
    }

    checkHasCharacter(character, direction) {
        const { x: newX, y: newY } = this.getNewPosition(character, direction);
        return !this.isCellEmpty(newX, newY);
    }

    checkKeyPressed(key) {
        return this.project.pressedKeys?.[key] || false;
    }

    applyRule(character, rule) {
        switch (rule.type) {
            case 'move':
                return this.handleMove(character, rule.direction);
            case 'jump':
                return this.handleJump(character, rule.direction);
            case 'turn':
                return this.handleTurn(character, rule.direction);
            case 'change_sprite':
                return { sprite: rule.sprite };
            case 'disappear':
                return { isVisible: false };
            case 'appear':
                return { isVisible: true };
            default:
                return null;
        }
    }

    handleMove(character, direction) {
        const { x: newX, y: newY } = this.getNewPosition(character, direction);
        
        if (this.isValidPosition(newX, newY) && this.isCellEmpty(newX, newY)) {
            return { x: newX, y: newY };
        }
        
        return null;
    }

    handleJump(character, direction) {
        const { x: newX, y: newY } = this.getNewPosition(character, direction, 2);
        
        if (this.isValidPosition(newX, newY) && this.isCellEmpty(newX, newY)) {
            return { x: newX, y: newY };
        }
        
        return null;
    }

    handleTurn(character, direction) {
        // Implement sprite rotation or direction change
        return { direction };
    }

    getNewPosition(character, direction, distance = 1) {
        let newX = character.x;
        let newY = character.y;

        switch (direction) {
            case 'right':
                newX += distance;
                break;
            case 'left':
                newX -= distance;
                break;
            case 'up':
                newY -= distance;
                break;
            case 'down':
                newY += distance;
                break;
        }

        return { x: newX, y: newY };
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.project.gridSize && 
               y >= 0 && y < this.project.gridSize;
    }

    isCellEmpty(x, y) {
        if (!this.isValidPosition(x, y)) return false;
        
        return !this.project.characters.some(
            char => char.x === x && char.y === y && char.isVisible !== false
        );
    }

    // Helper method to update pressed keys
    updatePressedKeys(pressedKeys) {
        this.project = {
            ...this.project,
            pressedKeys
        };
    }

    // Reset simulation state
    reset() {
        this.frameCount = 0;
        this.stop();
    }
}

export default SimulationEngine;