class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        this.isMuted = false;
        this.volume = 1.0;
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;
        this.context = null;

        this.initAudioContext();
    }

    // Initialize Web Audio API context
    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        } catch (error) {
            console.error('Web Audio API not supported:', error);
        }
    }

    // Load a sound effect
    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            
            this.sounds.set(name, {
                buffer: audioBuffer,
                sources: new Set()
            });
            
            return true;
        } catch (error) {
            console.error(`Failed to load sound '${name}':`, error);
            return false;
        }
    }

    // Load background music
    async loadMusic(name, url) {
        try {
            const audio = new Audio(url);
            audio.loop = true;
            
            this.music.set(name, {
                audio,
                volume: this.musicVolume
            });
            
            return true;
        } catch (error) {
            console.error(`Failed to load music '${name}':`, error);
            return false;
        }
    }

    // Play a sound effect
    playSound(name, options = {}) {
        if (this.isMuted) return null;
        
        const sound = this.sounds.get(name);
        if (!sound) {
            console.warn(`Sound '${name}' not found`);
            return null;
        }

        try {
            const source = this.context.createBufferSource();
            const gainNode = this.context.createGain();
            
            source.buffer = sound.buffer;
            source.connect(gainNode);
            gainNode.connect(this.context.destination);

            // Apply options
            gainNode.gain.value = (options.volume ?? 1) * this.soundVolume * this.volume;
            source.playbackRate.value = options.playbackRate ?? 1;
            if (options.loop) source.loop = true;

            // Start playback
            const startTime = options.delay ? this.context.currentTime + options.delay : this.context.currentTime;
            source.start(startTime);

            // Store source for stopping later
            sound.sources.add(source);

            // Clean up when finished
            source.onended = () => {
                sound.sources.delete(source);
                source.disconnect();
                gainNode.disconnect();
            };

            return source;
        } catch (error) {
            console.error(`Failed to play sound '${name}':`, error);
            return null;
        }
    }

    // Play background music
    playMusic(name, fadeInDuration = 0) {
        if (this.isMuted) return;

        const music = this.music.get(name);
        if (!music) {
            console.warn(`Music '${name}' not found`);
            return;
        }

        // Stop current music
        if (this.currentMusic && this.currentMusic !== name) {
            this.stopMusic(fadeInDuration);
        }

        try {
            music.audio.volume = fadeInDuration > 0 ? 0 : this.musicVolume * this.volume;
            music.audio.play();
            this.currentMusic = name;

            // Fade in if requested
            if (fadeInDuration > 0) {
                const startTime = performance.now();
                const animate = () => {
                    const elapsed = performance.now() - startTime;
                    const progress = Math.min(elapsed / fadeInDuration, 1);
                    music.audio.volume = progress * this.musicVolume * this.volume;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);
            }
        } catch (error) {
            console.error(`Failed to play music '${name}':`, error);
        }
    }

    // Stop a specific sound
    stopSound(name) {
        const sound = this.sounds.get(name);
        if (!sound) return;

        sound.sources.forEach(source => {
            try {
                source.stop();
            } catch (error) {
                console.error(`Failed to stop sound '${name}':`, error);
            }
        });
        sound.sources.clear();
    }

    // Stop background music
    stopMusic(fadeOutDuration = 0) {
        if (!this.currentMusic) return;

        const music = this.music.get(this.currentMusic);
        if (!music) return;

        if (fadeOutDuration > 0) {
            const startVolume = music.audio.volume;
            const startTime = performance.now();
            
            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / fadeOutDuration, 1);
                music.audio.volume = startVolume * (1 - progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    music.audio.pause();
                    music.audio.currentTime = 0;
                }
            };
            requestAnimationFrame(animate);
        } else {
            music.audio.pause();
            music.audio.currentTime = 0;
        }

        this.currentMusic = null;
    }

    // Set master volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update music volume
        if (this.currentMusic) {
            const music = this.music.get(this.currentMusic);
            if (music) {
                music.audio.volume = this.musicVolume * this.volume;
            }
        }
    }

    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            const music = this.music.get(this.currentMusic);
            if (music) {
                music.audio.volume = this.musicVolume * this.volume;
            }
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
            const music = this.music.get(this.currentMusic);
            if (music) {
                music.audio.volume = muted ? 0 : this.musicVolume * this.volume;
            }
        }

        if (muted) {
            this.sounds.forEach(sound => {
                sound.sources.forEach(source => {
                    try {
                        source.stop();
                    } catch (error) {
                        // Ignore errors from already stopped sources
                    }
                });
                sound.sources.clear();
            });
        }
    }

    // Clean up resources
    dispose() {
        this.stopMusic();
        this.sounds.forEach(sound => this.stopSound(sound));
        this.sounds.clear();
        this.music.clear();
        if (this.context) {
            this.context.close();
        }
    }
}

export default new AudioManager();
