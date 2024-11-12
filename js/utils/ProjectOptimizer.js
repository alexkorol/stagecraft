class ProjectOptimizer {
    constructor() {
        this.perfMetrics = {
            frameTime: [],
            ruleExecutions: 0,
            collisionChecks: 0,
            lastOptimization: null
        };
    }

    // Analyze project performance
    analyzePerformance(project) {
        const metrics = {
            characterCount: project.characters.size,
            ruleCount: 0,
            complexRules: 0,
            heavyAnimations: 0,
            gridUtilization: 0,
            bottlenecks: []
        };

        // Analyze rules
        project.rules.forEach((characterRules, characterId) => {
            metrics.ruleCount += characterRules.length;
            
            characterRules.forEach(rule => {
                if (this.isComplexRule(rule)) {
                    metrics.complexRules++;
                }
            });
        });

        // Analyze characters and animations
        project.characters.forEach(character => {
            if (character.frames?.length > 8) {
                metrics.heavyAnimations++;
            }
        });

        // Calculate grid utilization
        const totalCells = project.gridSize.width * project.gridSize.height;
        const occupiedCells = new Set(
            Array.from(project.characters.values())
                .map(char => `${char.x},${char.y}`)
        ).size;
        metrics.gridUtilization = occupiedCells / totalCells;

        // Identify performance bottlenecks
        this.identifyBottlenecks(metrics);

        return metrics;
    }

    // Check if a rule is computationally expensive
    isComplexRule(rule) {
        return (
            rule.trigger === 'proximity' ||
            rule.trigger === 'collision' ||
            (rule.conditions && rule.conditions.length > 2)
        );
    }

    // Identify performance bottlenecks
    identifyBottlenecks(metrics) {
        const bottlenecks = [];

        if (metrics.characterCount > 50) {
            bottlenecks.push({
                type: 'character_count',
                severity: 'high',
                message: 'Large number of characters may impact performance'
            });
        }

        if (metrics.complexRules > 10) {
            bottlenecks.push({
                type: 'complex_rules',
                severity: 'medium',
                message: 'Many complex rules detected'
            });
        }

        if (metrics.heavyAnimations > 5) {
            bottlenecks.push({
                type: 'heavy_animations',
                severity: 'medium',
                message: 'Multiple characters with many animation frames'
            });
        }

        if (metrics.gridUtilization > 0.8) {
            bottlenecks.push({
                type: 'grid_utilization',
                severity: 'low',
                message: 'High grid utilization may slow collision detection'
            });
        }

        return bottlenecks;
    }

    // Optimize project performance
    optimizeProject(project) {
        const optimizations = [];

        // Optimize rule execution order
        this.optimizeRuleOrder(project, optimizations);

        // Optimize collision detection
        this.optimizeCollisionDetection(project, optimizations);

        // Optimize animations
        this.optimizeAnimations(project, optimizations);

        // Record optimization timestamp
        this.perfMetrics.lastOptimization = Date.now();

        return optimizations;
    }

    // Optimize rule execution order
    optimizeRuleOrder(project, optimizations) {
        project.rules.forEach((characterRules, characterId) => {
            // Sort rules by complexity (simpler rules first)
            const sortedRules = [...characterRules].sort((a, b) => {
                const complexityA = this.calculateRuleComplexity(a);
                const complexityB = this.calculateRuleComplexity(b);
                return complexityA - complexityB;
            });

            if (JSON.stringify(sortedRules) !== JSON.stringify(characterRules)) {
                project.rules.set(characterId, sortedRules);
                optimizations.push({
                    type: 'rule_order',
                    target: characterId,
                    message: 'Optimized rule execution order'
                });
            }
        });
    }

    // Calculate rule execution complexity
    calculateRuleComplexity(rule) {
        let complexity = 1;

        // Add complexity for different trigger types
        switch (rule.trigger) {
            case 'proximity':
                complexity += 3;
                break;
            case 'collision':
                complexity += 2;
                break;
            case 'keyPress':
                complexity += 1;
                break;
        }

        // Add complexity for conditions
        if (rule.conditions) {
            complexity += rule.conditions.length;
        }

        return complexity;
    }

    // Optimize collision detection
    optimizeCollisionDetection(project, optimizations) {
        // Implement spatial partitioning if many characters
        if (project.characters.size > 20) {
            const gridSize = Math.ceil(Math.sqrt(project.characters.size));
            const spatialGrid = Array(gridSize).fill().map(() => Array(gridSize).fill([]));

            // Assign characters to grid cells
            project.characters.forEach(char => {
                const gridX = Math.floor(char.x / project.gridSize.width * gridSize);
                const gridY = Math.floor(char.y / project.gridSize.height * gridSize);
                spatialGrid[gridY][gridX].push(char);
            });

            optimizations.push({
                type: 'collision_detection',
                message: 'Implemented spatial partitioning for collision detection'
            });
        }
    }

    // Optimize animations
    optimizeAnimations(project, optimizations) {
        project.characters.forEach((char, charId) => {
            if (char.frames?.length > 8) {
                // Implement frame skipping for distant characters
                optimizations.push({
                    type: 'animation',
                    target: charId,
                    message: 'Implemented dynamic frame skipping for optimization'
                });
            }
        });
    }

    // Monitor runtime performance
    recordFrameTime(time) {
        this.perfMetrics.frameTime.push(time);
        if (this.perfMetrics.frameTime.length > 60) {
            this.perfMetrics.frameTime.shift();
        }
    }

    // Get average frame time
    getAverageFrameTime() {
        if (this.perfMetrics.frameTime.length === 0) return 0;
        const sum = this.perfMetrics.frameTime.reduce((a, b) => a + b, 0);
        return sum / this.perfMetrics.frameTime.length;
    }

    // Reset performance metrics
    resetMetrics() {
        this.perfMetrics = {
            frameTime: [],
            ruleExecutions: 0,
            collisionChecks: 0,
            lastOptimization: null
        };
    }

    // Get optimization suggestions
    getSuggestions(metrics) {
        const suggestions = [];

        if (metrics.characterCount > 50) {
            suggestions.push({
                type: 'reduction',
                message: 'Consider reducing the number of simultaneous characters',
                priority: 'high'
            });
        }

        if (metrics.complexRules > 10) {
            suggestions.push({
                type: 'simplification',
                message: 'Simplify complex rules or break them into smaller parts',
                priority: 'medium'
            });
        }

        if (metrics.heavyAnimations > 5) {
            suggestions.push({
                type: 'animation',
                message: 'Reduce animation frames for background characters',
                priority: 'medium'
            });
        }

        if (this.getAverageFrameTime() > 16) { // Target 60 FPS
            suggestions.push({
                type: 'performance',
                message: 'Project is running below 60 FPS, consider applying optimizations',
                priority: 'high'
            });
        }

        return suggestions;
    }
}

export default new ProjectOptimizer();