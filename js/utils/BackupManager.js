import { LOCAL_STORAGE_KEYS } from '../constants';

class BackupManager {
    constructor() {
        this.backupInterval = 5 * 60 * 1000; // 5 minutes
        this.maxBackups = 5;
        this.intervalId = null;
        this.lastBackupTime = null;
    }

    // Start automatic backups
    startAutoBackup(getProjectState) {
        if (this.intervalId) return;

        // Initial backup
        this.createBackup(getProjectState());

        // Set up interval for regular backups
        this.intervalId = setInterval(() => {
            this.createBackup(getProjectState());
        }, this.backupInterval);
    }

    // Stop automatic backups
    stopAutoBackup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Create a backup
    createBackup(projectState) {
        try {
            const backups = this.getBackups();
            const timestamp = Date.now();

            // Add new backup
            backups.unshift({
                timestamp,
                state: projectState
            });

            // Keep only the most recent backups
            const trimmedBackups = backups.slice(0, this.maxBackups);

            // Save to localStorage
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.PROJECT + '_backups',
                JSON.stringify(trimmedBackups)
            );

            this.lastBackupTime = timestamp;
            console.info('Project backup created:', new Date(timestamp).toLocaleString());

            return true;
        } catch (error) {
            console.error('Failed to create backup:', error);
            return false;
        }
    }

    // Get all backups
    getBackups() {
        try {
            const backupsJson = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECT + '_backups');
            return backupsJson ? JSON.parse(backupsJson) : [];
        } catch (error) {
            console.error('Failed to retrieve backups:', error);
            return [];
        }
    }

    // Restore from a specific backup
    restoreBackup(timestamp) {
        try {
            const backups = this.getBackups();
            const backup = backups.find(b => b.timestamp === timestamp);
            
            if (!backup) {
                throw new Error('Backup not found');
            }

            return backup.state;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return null;
        }
    }

    // Restore latest backup
    restoreLatestBackup() {
        const backups = this.getBackups();
        if (backups.length === 0) return null;
        return backups[0].state;
    }

    // Check if there are unsaved changes
    hasUnsavedChanges(currentState) {
        const latestBackup = this.restoreLatestBackup();
        if (!latestBackup) return true;

        // Compare current state with latest backup
        return JSON.stringify(currentState) !== JSON.stringify(latestBackup.state);
    }

    // Delete a specific backup
    deleteBackup(timestamp) {
        try {
            let backups = this.getBackups();
            backups = backups.filter(b => b.timestamp !== timestamp);
            
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.PROJECT + '_backups',
                JSON.stringify(backups)
            );

            return true;
        } catch (error) {
            console.error('Failed to delete backup:', error);
            return false;
        }
    }

    // Delete all backups
    clearBackups() {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.PROJECT + '_backups');
            return true;
        } catch (error) {
            console.error('Failed to clear backups:', error);
            return false;
        }
    }

    // Get backup stats
    getBackupStats() {
        const backups = this.getBackups();
        return {
            count: backups.length,
            oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
            newestBackup: backups.length > 0 ? backups[0].timestamp : null,
            totalSize: new Blob([JSON.stringify(backups)]).size
        };
    }

    // Export backups
    exportBackups() {
        try {
            const backups = this.getBackups();
            const blob = new Blob([JSON.stringify(backups, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stagecraft_backups_${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Failed to export backups:', error);
            return false;
        }
    }

    // Import backups
    async importBackups(file) {
        try {
            const text = await file.text();
            const backups = JSON.parse(text);
            
            if (!Array.isArray(backups)) {
                throw new Error('Invalid backup format');
            }

            localStorage.setItem(
                LOCAL_STORAGE_KEYS.PROJECT + '_backups',
                JSON.stringify(backups)
            );

            return true;
        } catch (error) {
            console.error('Failed to import backups:', error);
            return false;
        }
    }

    // Set backup interval
    setBackupInterval(minutes) {
        this.backupInterval = minutes * 60 * 1000;
        if (this.intervalId) {
            this.stopAutoBackup();
            this.startAutoBackup();
        }
    }

    // Set maximum number of backups
    setMaxBackups(count) {
        this.maxBackups = Math.max(1, count);
        // Trim existing backups if necessary
        const backups = this.getBackups();
        if (backups.length > this.maxBackups) {
            const trimmedBackups = backups.slice(0, this.maxBackups);
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.PROJECT + '_backups',
                JSON.stringify(trimmedBackups)
            );
        }
    }
}

export default new BackupManager();