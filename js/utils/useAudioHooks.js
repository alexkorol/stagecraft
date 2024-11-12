import { useState, useEffect, useCallback } from 'react';
import AudioManager from './AudioManager';

// Hook for using AudioManager in React components
export const useAudioManager = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load common game sounds
    useEffect(() => {
        const loadGameSounds = async () => {
            try {
                await Promise.all([
                    AudioManager.loadSound('click', '/sounds/click.mp3'),
                    AudioManager.loadSound('move', '/sounds/move.mp3'),
                    AudioManager.loadSound('collision', '/sounds/collision.mp3'),
                    AudioManager.loadSound('success', '/sounds/success.mp3'),
                    AudioManager.loadSound('failure', '/sounds/failure.mp3'),
                    AudioManager.loadMusic('background', '/sounds/background.mp3')
                ]);
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to load game sounds:', error);
            }
        };

        loadGameSounds();

        // Cleanup when component unmounts
        return () => {
            AudioManager.stopMusic();
        };
    }, []);

    const toggleMute = useCallback(() => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        AudioManager.setMuted(newMuted);
    }, [isMuted]);

    const updateVolume = useCallback((newVolume) => {
        setVolume(newVolume);
        AudioManager.setVolume(newVolume);
    }, []);

    return {
        playSound: AudioManager.playSound.bind(AudioManager),
        playMusic: AudioManager.playMusic.bind(AudioManager),
        stopMusic: AudioManager.stopMusic.bind(AudioManager),
        stopSound: AudioManager.stopSound.bind(AudioManager),
        setMusicVolume: AudioManager.setMusicVolume.bind(AudioManager),
        setSoundVolume: AudioManager.setSoundVolume.bind(AudioManager),
        toggleMute,
        updateVolume,
        isMuted,
        volume,
        isLoaded
    };
};

// Hook for managing background music
export const useBackgroundMusic = (musicName = 'background', options = {}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    useEffect(() => {
        if (options.autoPlay) {
            AudioManager.playMusic(musicName, options.fadeIn);
            setIsPlaying(true);
        }

        return () => {
            if (options.stopOnUnmount) {
                AudioManager.stopMusic(options.fadeOut);
            }
        };
    }, [musicName]);

    const play = useCallback((fadeIn) => {
        AudioManager.playMusic(musicName, fadeIn);
        setIsPlaying(true);
    }, [musicName]);

    const stop = useCallback((fadeOut) => {
        AudioManager.stopMusic(fadeOut);
        setIsPlaying(false);
    }, []);

    const toggle = useCallback((fadeIn, fadeOut) => {
        if (isPlaying) {
            stop(fadeOut);
        } else {
            play(fadeIn);
        }
    }, [isPlaying, play, stop]);

    return {
        play,
        stop,
        toggle,
        isPlaying
    };
};

// Hook for managing sound effects
export const useSoundEffect = (soundName) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [instances, setInstances] = useState(new Set());

    const play = useCallback((options = {}) => {
        const instance = AudioManager.playSound(soundName, options);
        if (instance) {
            setIsPlaying(true);
            setInstances(prev => new Set([...prev, instance]));

            instance.onended = () => {
                setInstances(prev => {
                    const next = new Set(prev);
                    next.delete(instance);
                    if (next.size === 0) {
                        setIsPlaying(false);
                    }
                    return next;
                });
            };
        }
        return instance;
    }, [soundName]);

    const stop = useCallback(() => {
        AudioManager.stopSound(soundName);
        setIsPlaying(false);
        setInstances(new Set());
    }, [soundName]);

    return {
        play,
        stop,
        isPlaying,
        activeInstances: instances.size
    };
};

export default {
    useAudioManager,
    useBackgroundMusic,
    useSoundEffect
};