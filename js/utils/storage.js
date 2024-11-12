class StorageManager {
    static PROJECT_KEY = 'stagecraft_projects';
    static CURRENT_PROJECT_KEY = 'stagecraft_current_project';

    static saveProject(project) {
        const projects = this.getAllProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);
        
        if (existingIndex >= 0) {
            projects[existingIndex] = project;
        } else {
            projects.push(project);
        }

        localStorage.setItem(this.PROJECT_KEY, JSON.stringify(projects));
        this.setCurrentProject(project);
    }

    static getAllProjects() {
        const projectsJson = localStorage.getItem(this.PROJECT_KEY);
        return projectsJson ? JSON.parse(projectsJson) : [];
    }

    static getProject(id) {
        const projects = this.getAllProjects();
        return projects.find(p => p.id === id);
    }

    static deleteProject(id) {
        const projects = this.getAllProjects();
        const filteredProjects = projects.filter(p => p.id !== id);
        localStorage.setItem(this.PROJECT_KEY, JSON.stringify(filteredProjects));
        
        if (this.getCurrentProject()?.id === id) {
            this.clearCurrentProject();
        }
    }

    static setCurrentProject(project) {
        localStorage.setItem(this.CURRENT_PROJECT_KEY, JSON.stringify(project));
    }

    static getCurrentProject() {
        const projectJson = localStorage.getItem(this.CURRENT_PROJECT_KEY);
        return projectJson ? JSON.parse(projectJson) : null;
    }

    static clearCurrentProject() {
        localStorage.removeItem(this.CURRENT_PROJECT_KEY);
    }

    static exportProject(project) {
        const projectJson = JSON.stringify(project);
        const blob = new Blob([projectJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name || 'stagecraft_project'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async importProject(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const project = JSON.parse(e.target.result);
                    this.saveProject(project);
                    resolve(project);
                } catch (error) {
                    reject(new Error('Invalid project file'));
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    static createNewProject(name) {
        const project = {
            id: Date.now().toString(),
            name: name || 'Untitled Project',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            gridSize: 8,
            characters: [],
            rules: [],
            scenes: [{
                id: 'main',
                name: 'Main Scene',
                grid: Array(8).fill().map(() => Array(8).fill(null))
            }]
        };
        
        this.saveProject(project);
        return project;
    }
}

export default StorageManager;