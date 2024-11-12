class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        this.isMuted = false;
        this.volume = 1.0;
        this.musicVolume = 0.7;
        this.soundVolume = 1.0;
    }

    // Load a sound effect
    async loadSound(name, url) {
        try {
            const audio = new Audio();
            audio.src = url;
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve);
                audio.addEventListener('error', reject);
                audio.load();
            });
            this.sounds.set(name, audio);
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
        }
    }

    // Load background music
    async loadMusic(name, url) {
        try {
            const audio = new Audio();
            audio.src = url;
            audio.loop = true;
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve);
                audio.addEventListener('error', reject);
                audio.load();
            });
            this.music.set(name, audio);
        } catch (error) {
            console.error(`Failed to load music ${name}:`, error);
        }
    }

    // Play a sound effect
    playSound(name, options = {}) {
        if (this.isMuted) return;

        const sound = this.sounds.get(name);
        if (!sound) return;

        // Clone the audio to allow multiple simultaneous plays
        const soundInstance = sound.cloneNode();
        soundInstance.volume = this.soundVolume * this.volume * (options.volume || 1.0);
        
        if (options.loop) {
            soundInstance.loop = true;
        }

        if (options.pitch) {
            soundInstance.playbackRate = options.pitch;
        }

        const promise = soundInstance.play();
        if (promise) {
            promise.catch(error => {
                console.error(`Failed to play sound ${name}:`, error);
            });
        }

        return soundInstance;
    }

    // Play background music
    playMusic(name, fadeInDuration = 0) {
        if (this.isMuted) return;

        const music = this.music.get(name);
        if (!music) return;

        if (this.currentMusic) {
            this.stopMusic(fadeInDuration);
        }

        music.volume = 0;
        music.play();
        this.currentMusic = music;

        if (fadeInDuration > 0) {
            this.fadeIn(music, this.musicVolume * this.volume, fadeInDuration);
        } else {
            music.volume = this.musicVolume * this.volume;
        }
    }

    // Stop background music
    stopMusic(fadeOutDuration = 0) {
        if (!this.currentMusic) return;

        if (fadeOutDuration > 0) {
            this.fadeOut(this.currentMusic, fadeOutDuration).then(() => {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            });
        } else {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

    // Fade in audio
    fadeIn(audio, targetVolume, duration) {
        const steps = 60;
        const stepTime = duration / steps;
        const stepVolume = targetVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.min(stepVolume * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
            }
        }, stepTime);
    }

    // Fade out audio
    async fadeOut(audio, duration) {
        return new Promise(resolve => {
            const startVolume = audio.volume;
            const steps = 60;
            const stepTime = duration / steps;
            const stepVolume = startVolume / steps;
            let currentStep = steps;

            const fadeInterval = setInterval(() => {
                currentStep--;
                audio.volume = stepVolume * currentStep;

                if (currentStep <= 0) {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, stepTime);
        });
    }

    // Set master volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update current music volume
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.volume;
        }
    }

    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.volume;
        }
    }

    // Set sound effects volume
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }

    // Mute/unmute all audio
    setMuted(muted) {
        this.isMuted = muted;
        if (this.currentMusic) {
            this.currentMusic.volume = muted ? 0 : this.musicVolume * this.volume;
        }
    }

    // Preload common game sounds
    async preloadGameSounds() {
        const soundsToLoad = {
            'click': '/sounds/click.mp3',
            'move': '/sounds/move.mp3',
            'collision': '/sounds/collision.mp3',
            'success': '/sounds/success.mp3',
            'failure': '/sounds/failure.mp3',
            'background': '/sounds/background.mp3'
        };

        const loadPromises = [];
        for (const [name, url] of Object.entries(soundsToLoad)) {
            if (url.includes('background')) {
                loadPromises.push(this.loadMusic(name, url));
            } else {
                loadPromises.push(this.loadSound(name, url));
            }
        }

        await Promise.all(loadPromises);
    }
}

// React hook for using AudioManager
const useAudioManager = () => {
    const [audioManager] = React.useState(() => new AudioManager());
    const [isMuted, setIsMuted] = React.useState(false);
    const [volume, setVolume] = React.useState(1.0);

    React.useEffect(() => {
        // Load sounds when component mounts
        audioManager.preloadGameSounds();

        // Clean up when component unmounts
        return () => {
            audioManager.stopMusic();
        };
    }, [audioManager]);

    const toggleMute = React.useCallback(() => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        audioManager.setMuted(newMuted);
    }, [isMuted, audioManager]);

    const updateVolume = React.useCallback((newVolume) => {
        setVolume(newVolume);
        audioManager.setVolume(newVolume);
    }, [audioManager]);

    return {
        playSound: audioManager.playSound.bind(audioManager),
        playMusic: audioManager.playMusic.bind(audioManager),
        stopMusic: audioManager.stopMusic.bind(audioManager),
        setMusicVolume: audioManager.setMusicVolume.bind(audioManager),
        setSoundVolume: audioManager.setSoundVolume.bind(audioManager),
        toggleMute,
        updateVolume,
        isMuted,
        volume
    };
};

export { AudioManager, useAudioManager };