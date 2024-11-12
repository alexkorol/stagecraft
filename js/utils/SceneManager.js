class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
        this.isTransitioning = false;
        this.transitionDuration = 500; // ms
    }

    // Add a new scene
    addScene(sceneName, {
        gridSize,
        characters = new Map(),
        rules = new Map(),
        backgroundColor = '#FFFFFF',
        backgroundImage = null,
        onEnter = null,
        onExit = null
    }) {
        this.scenes.set(sceneName, {
            name: sceneName,
            gridSize,
            characters: new Map(characters),
            rules: new Map(rules),
            backgroundColor,
            backgroundImage,
            onEnter,
            onExit
        });
    }

    // Switch to a different scene
    async switchScene(sceneName, transitionEffect = 'fade') {
        if (this.isTransitioning || !this.scenes.has(sceneName)) return;
        
        const previousScene = this.currentScene;
        const nextScene = this.scenes.get(sceneName);

        this.isTransitioning = true;

        // Call exit handler of current scene
        if (previousScene?.onExit) {
            await previousScene.onExit();
        }

        // Perform transition effect
        await this.performTransition(transitionEffect, previousScene, nextScene);

        // Update current scene
        this.currentScene = nextScene;

        // Call enter handler of new scene
        if (nextScene.onEnter) {
            await nextScene.onEnter();
        }

        this.isTransitioning = false;
    }

    // Handle scene transitions
    async performTransition(effect, fromScene, toScene) {
        return new Promise(resolve => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const progress = Math.min(
                    (currentTime - startTime) / this.transitionDuration,
                    1
                );

                switch (effect) {
                    case 'fade':
                        this.applyFadeEffect(progress, fromScene, toScene);
                        break;
                    case 'slide':
                        this.applySlideEffect(progress, fromScene, toScene);
                        break;
                    case 'zoom':
                        this.applyZoomEffect(progress, fromScene, toScene);
                        break;
                    default:
                        // Instant switch
                        progress = 1;
                        break;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    // Transition effects
    applyFadeEffect(progress, fromScene, toScene) {
        if (fromScene) {
            fromScene.opacity = 1 - progress;
        }
        if (toScene) {
            toScene.opacity = progress;
        }
    }

    applySlideEffect(progress, fromScene, toScene) {
        if (fromScene) {
            fromScene.position = {
                x: -progress * 100 + '%',
                y: 0
            };
        }
        if (toScene) {
            toScene.position = {
                x: (1 - progress) * 100 + '%',
                y: 0
            };
        }
    }

    applyZoomEffect(progress, fromScene, toScene) {
        if (fromScene) {
            fromScene.scale = 1 - progress * 0.5;
            fromScene.opacity = 1 - progress;
        }
        if (toScene) {
            toScene.scale = 0.5 + progress * 0.5;
            toScene.opacity = progress;
        }
    }

    // Get current scene
    getCurrentScene() {
        return this.currentScene;
    }

    // Get scene by name
    getScene(sceneName) {
        return this.scenes.get(sceneName);
    }

    // Update scene properties
    updateScene(sceneName, properties) {
        const scene = this.scenes.get(sceneName);
        if (!scene) return;

        Object.assign(scene, properties);
    }

    // Add character to current scene
    addCharacterToScene(character) {
        if (!this.currentScene) return;
        this.currentScene.characters.set(character.id, character);
    }

    // Remove character from current scene
    removeCharacterFromScene(characterId) {
        if (!this.currentScene) return;
        this.currentScene.characters.delete(characterId);
    }

    // Add rule to current scene
    addRuleToScene(characterId, rule) {
        if (!this.currentScene) return;
        
        if (!this.currentScene.rules.has(characterId)) {
            this.currentScene.rules.set(characterId, []);
        }
        this.currentScene.rules.get(characterId).push(rule);
    }

    // Remove rule from current scene
    removeRuleFromScene(characterId, ruleId) {
        if (!this.currentScene) return;
        
        const rules = this.currentScene.rules.get(characterId);
        if (rules) {
            const index = rules.findIndex(r => r.id === ruleId);
            if (index !== -1) {
                rules.splice(index, 1);
            }
        }
    }

    // Save scene state
    saveSceneState(sceneName) {
        const scene = this.scenes.get(sceneName);
        if (!scene) return null;

        return {
            name: scene.name,
            characters: Array.from(scene.characters.entries()),
            rules: Array.from(scene.rules.entries()),
            gridSize: scene.gridSize,
            backgroundColor: scene.backgroundColor,
            backgroundImage: scene.backgroundImage
        };
    }

    // Load scene state
    loadSceneState(sceneName, state) {
        if (!state || !this.scenes.has(sceneName)) return;

        const scene = this.scenes.get(sceneName);
        scene.characters = new Map(state.characters);
        scene.rules = new Map(state.rules);
        scene.gridSize = state.gridSize;
        scene.backgroundColor = state.backgroundColor;
        scene.backgroundImage = state.backgroundImage;
    }

    // Reset current scene
    resetCurrentScene() {
        if (!this.currentScene) return;
        
        // Reset all characters to their initial positions
        this.currentScene.characters.forEach(character => {
            if (character.initialX !== undefined && character.initialY !== undefined) {
                character.x = character.initialX;
                character.y = character.initialY;
            }
        });
    }
}

export default new SceneManager();
