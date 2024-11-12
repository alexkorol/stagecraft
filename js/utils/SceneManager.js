class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
        this.transitionCallbacks = new Map();
        this.globalState = {};
    }

    // Add a new scene
    addScene(sceneName, sceneData) {
        this.scenes.set(sceneName, {
            ...sceneData,
            characters: sceneData.characters || [],
            rules: sceneData.rules || [],
            grid: sceneData.grid || [],
            state: sceneData.state || {},
            onEnter: sceneData.onEnter || (() => {}),
            onExit: sceneData.onExit || (() => {}),
            onUpdate: sceneData.onUpdate || (() => {})
        });
    }

    // Switch to a different scene
    async switchScene(sceneName, transitionData = {}) {
        if (!this.scenes.has(sceneName)) {
            throw new Error(`Scene "${sceneName}" not found`);
        }

        const previousScene = this.currentScene;
        const nextScene = this.scenes.get(sceneName);

        // Execute exit callbacks
        if (previousScene) {
            await previousScene.onExit(this.globalState, transitionData);
        }

        // Execute transition callbacks
        const transitionKey = previousScene 
            ? `${previousScene.name}->${sceneName}`
            : `->${sceneName}`;
            
        if (this.transitionCallbacks.has(transitionKey)) {
            await this.transitionCallbacks.get(transitionKey)(
                previousScene,
                nextScene,
                transitionData
            );
        }

        // Execute enter callbacks
        await nextScene.onEnter(this.globalState, transitionData);

        this.currentScene = nextScene;
        return nextScene;
    }

    // Register a transition callback
    registerTransition(fromScene, toScene, callback) {
        const key = `${fromScene}->${toScene}`;
        this.transitionCallbacks.set(key, callback);
    }

    // Update the current scene
    update(deltaTime) {
        if (this.currentScene && this.currentScene.onUpdate) {
            this.currentScene.onUpdate(deltaTime, this.globalState);
        }
    }

    // Get current scene data
    getCurrentScene() {
        return this.currentScene;
    }

    // Update global state
    updateGlobalState(updates) {
        this.globalState = {
            ...this.globalState,
            ...updates
        };
    }

    // Save scene state
    saveSceneState(sceneName, state) {
        if (!this.scenes.has(sceneName)) return;
        
        const scene = this.scenes.get(sceneName);
        scene.state = {
            ...scene.state,
            ...state
        };
    }

    // Load scene state
    loadSceneState(sceneName) {
        if (!this.scenes.has(sceneName)) return null;
        return this.scenes.get(sceneName).state;
    }

    // Reset scene to initial state
    resetScene(sceneName) {
        if (!this.scenes.has(sceneName)) return;
        
        const scene = this.scenes.get(sceneName);
        scene.state = {};
        scene.characters = [...scene.initialCharacters || []];
        scene.rules = [...scene.initialRules || []];
    }

    // Get all available scenes
    getScenes() {
        return Array.from(this.scenes.keys());
    }
}

// React hook for using SceneManager
const useSceneManager = () => {
    const [sceneManager] = React.useState(() => new SceneManager());
    const [currentScene, setCurrentScene] = React.useState(null);
    const [globalState, setGlobalState] = React.useState({});

    // Initialize scene manager
    React.useEffect(() => {
        const handleSceneChange = () => {
            setCurrentScene(sceneManager.getCurrentScene());
            setGlobalState(sceneManager.globalState);
        };

        // Add default scenes
        sceneManager.addScene('main', {
            name: 'main',
            characters: [],
            rules: [],
            grid: Array(8).fill().map(() => Array(8).fill(null)),
            onEnter: async () => {
                // Load main scene data
            }
        });

        // Listen for scene changes
        sceneManager.onSceneChange = handleSceneChange;

        // Switch to main scene
        sceneManager.switchScene('main');

        return () => {
            sceneManager.onSceneChange = null;
        };
    }, [sceneManager]);

    const switchScene = React.useCallback(async (sceneName, transitionData) => {
        try {
            await sceneManager.switchScene(sceneName, transitionData);
            return true;
        } catch (error) {
            console.error('Failed to switch scene:', error);
            return false;
        }
    }, [sceneManager]);

    const updateGlobalState = React.useCallback((updates) => {
        sceneManager.updateGlobalState(updates);
        setGlobalState(sceneManager.globalState);
    }, [sceneManager]);

    return {
        currentScene,
        globalState,
        switchScene,
        updateGlobalState,
        sceneManager
    };
};

export { SceneManager, useSceneManager };