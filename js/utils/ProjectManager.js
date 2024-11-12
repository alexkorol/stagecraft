import { LOCAL_STORAGE_KEYS, FILE_TYPES, ERROR_MESSAGES } from '../constants';

class ProjectManager {
    constructor() {
        this.currentProject = null;
        this.recentProjects = this.loadRecentProjects();
    }

    loadRecentProjects() {
        try {
            const recentProjects = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_PROJECTS);
            return recentProjects ? JSON.parse(recentProjects) : [];
        } catch (error) {
            console.error('Failed to load recent projects:', error);
            return [];
        }
    }

    updateRecentProjects(projectName) {
        this.recentProjects = [
            projectName,
            ...this.recentProjects.filter(name => name !== projectName)
        ].slice(0, MAX_RECENT_PROJECTS);

        localStorage.setItem(
            LOCAL_STORAGE_KEYS.RECENT_PROJECTS, 
            JSON.stringify(this.recentProjects)
        );
    }

    saveProject(project) {
        try {
            const projectData = {
                name: project.name,
                gridSize: project.gridSize,
                characters: Array.from(project.characters.values()).map(char => ({
                    ...char,
                    rules: project.rules.get(char.id) || []
                })),
                version: '1.0.0',
                timestamp: Date.now()
            };

            // Save to localStorage
            localStorage.setItem(
                `${LOCAL_STORAGE_KEYS.PROJECT}_${project.name}`,
                JSON.stringify(projectData)
            );

            // Update recent projects
            this.updateRecentProjects(project.name);

            // Save to file
            const blob = new Blob([JSON.stringify(projectData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name}${FILE_TYPES.PROJECT}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Failed to save project:', error);
            throw new Error(ERROR_MESSAGES.SAVE_FAILED);
        }
    }

    loadProject(nameOrFile) {
        try {
            if (typeof nameOrFile === 'string') {
                // Load from localStorage
                const projectData = localStorage.getItem(
                    `${LOCAL_STORAGE_KEYS.PROJECT}_${nameOrFile}`
                );
                if (!projectData) throw new Error(ERROR_MESSAGES.LOAD_FAILED);
                
                const project = JSON.parse(projectData);
                this.currentProject = this.parseProject(project);
                this.updateRecentProjects(nameOrFile);
                return this.currentProject;
            } else {
                // Load from file
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const project = JSON.parse(e.target.result);
                            this.currentProject = this.parseProject(project);
                            this.updateRecentProjects(project.name);
                            resolve(this.currentProject);
                        } catch (error) {
                            reject(new Error(ERROR_MESSAGES.INVALID_FILE));
                        }
                    };
                    reader.onerror = () => reject(new Error(ERROR_MESSAGES.LOAD_FAILED));
                    reader.readAsText(nameOrFile);
                });
            }
        } catch (error) {
            console.error('Failed to load project:', error);
            throw new Error(ERROR_MESSAGES.LOAD_FAILED);
        }
    }

    parseProject(projectData) {
        // Convert the flat project data back into a structured project
        const characters = new Map();
        const rules = new Map();

        projectData.characters.forEach(charData => {
            const { rules: charRules, ...character } = charData;
            characters.set(character.id, character);
            rules.set(character.id, charRules);
        });

        return {
            name: projectData.name,
            gridSize: projectData.gridSize,
            characters,
            rules,
            version: projectData.version,
            timestamp: projectData.timestamp
        };
    }

    exportSprite(sprite, name) {
        try {
            const spriteData = {
                name,
                pixels: sprite.pixels,
                size: sprite.size,
                frames: sprite.frames || [],
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(spriteData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}${FILE_TYPES.SPRITE}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Failed to export sprite:', error);
            throw new Error('Failed to export sprite');
        }
    }

    importSprite(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const spriteData = JSON.parse(e.target.result);
                    resolve(spriteData);
                } catch (error) {
                    reject(new Error(ERROR_MESSAGES.INVALID_FILE));
                }
            };
            reader.onerror = () => reject(new Error('Failed to import sprite'));
            reader.readAsText(file);
        });
    }

    deleteProject(name) {
        try {
            localStorage.removeItem(`${LOCAL_STORAGE_KEYS.PROJECT}_${name}`);
            this.recentProjects = this.recentProjects.filter(p => p !== name);
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.RECENT_PROJECTS,
                JSON.stringify(this.recentProjects)
            );
            return true;
        } catch (error) {
            console.error('Failed to delete project:', error);
            return false;
        }
    }

    getRecentProjects() {
        return this.recentProjects;
    }

    getCurrentProject() {
        return this.currentProject;
    }
}

export default new ProjectManager();