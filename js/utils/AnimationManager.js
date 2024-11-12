class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.currentFrame = 0;
        this.isPlaying = false;
        this.frameRate = 60;
        this.lastFrameTime = 0;
    }

    // Add a new animation sequence
    addAnimation(characterId, animationName, frames, options = {}) {
        const animation = {
            frames,
            currentFrame: 0,
            frameDelay: Math.floor(60 / (options.fps || 12)),
            frameCounter: 0,
            loop: options.loop !== false,
            onComplete: options.onComplete,
            isPlaying: false
        };

        if (!this.animations.has(characterId)) {
            this.animations.set(characterId, new Map());
        }
        
        this.animations.get(characterId).set(animationName, animation);
    }

    // Start playing an animation
    play(characterId, animationName) {
        const charAnimations = this.animations.get(characterId);
        if (!charAnimations) return null;

        const animation = charAnimations.get(animationName);
        if (!animation) return null;

        animation.isPlaying = true;
        animation.currentFrame = 0;
        animation.frameCounter = 0;

        if (!this.isPlaying) {
            this.isPlaying = true;
            this.animate();
        }

        return animation.frames[0];
    }

    // Stop a specific animation
    stop(characterId, animationName) {
        const charAnimations = this.animations.get(characterId);
        if (!charAnimations) return;

        const animation = charAnimations.get(animationName);
        if (!animation) return;

        animation.isPlaying = false;
    }

    // Stop all animations
    stopAll() {
        this.isPlaying = false;
        this.animations.forEach(charAnimations => {
            charAnimations.forEach(animation => {
                animation.isPlaying = false;
            });
        });
    }

    // Main animation loop
    animate(timestamp) {
        if (!this.isPlaying) return;

        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime < (1000 / this.frameRate)) {
            requestAnimationFrame(this.animate.bind(this));
            return;
        }

        this.lastFrameTime = timestamp;
        let hasPlayingAnimations = false;

        // Update all active animations
        this.animations.forEach((charAnimations, characterId) => {
            charAnimations.forEach((animation, animationName) => {
                if (!animation.isPlaying) return;

                hasPlayingAnimations = true;
                animation.frameCounter++;

                if (animation.frameCounter >= animation.frameDelay) {
                    animation.frameCounter = 0;
                    animation.currentFrame++;

                    if (animation.currentFrame >= animation.frames.length) {
                        if (animation.loop) {
                            animation.currentFrame = 0;
                        } else {
                            animation.isPlaying = false;
                            animation.onComplete?.();
                            return;
                        }
                    }
                }
            });
        });

        if (hasPlayingAnimations) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.isPlaying = false;
        }
    }

    // Get current frame for a specific animation
    getCurrentFrame(characterId, animationName) {
        const charAnimations = this.animations.get(characterId);
        if (!charAnimations) return null;

        const animation = charAnimations.get(animationName);
        if (!animation) return null;

        return animation.frames[animation.currentFrame];
    }

    // Create a sprite sheet animation
    createSpriteSheetAnimation(spriteSheet, frameWidth, frameHeight, sequence) {
        const frames = [];
        
        sequence.forEach(frameIndex => {
            const x = (frameIndex % (spriteSheet.width / frameWidth)) * frameWidth;
            const y = Math.floor(frameIndex / (spriteSheet.width / frameWidth)) * frameHeight;
            
            const frame = document.createElement('canvas');
            frame.width = frameWidth;
            frame.height = frameHeight;
            const ctx = frame.getContext('2d');
            
            ctx.drawImage(
                spriteSheet,
                x, y, frameWidth, frameHeight,
                0, 0, frameWidth, frameHeight
            );
            
            frames.push(frame);
        });
        
        return frames;
    }

    // Helper method to create a simple flip-book animation from sprite data
    createFlipBookAnimation(spriteData, numFrames) {
        const frames = [];
        const baseSprite = spriteData;
        
        for (let i = 0; i < numFrames; i++) {
            // Create variations of the base sprite for the animation
            const frame = baseSprite.map(row => [...row]);
            // Add animation-specific modifications here
            frames.push(frame);
        }
        
        return frames;
    }
}

// React hook for using AnimationManager
const useAnimation = () => {
    const [animationManager] = React.useState(() => new AnimationManager());
    const [frame, setFrame] = React.useState(0);

    const addAnimation = React.useCallback((characterId, animationName, frames, options) => {
        animationManager.addAnimation(characterId, animationName, frames, options);
    }, [animationManager]);

    const playAnimation = React.useCallback((characterId, animationName) => {
        const initialFrame = animationManager.play(characterId, animationName);
        setFrame(prev => prev + 1); // Force re-render
        return initialFrame;
    }, [animationManager]);

    const stopAnimation = React.useCallback((characterId, animationName) => {
        animationManager.stop(characterId, animationName);
        setFrame(prev => prev + 1); // Force re-render
    }, [animationManager]);

    const getCurrentFrame = React.useCallback((characterId, animationName) => {
        return animationManager.getCurrentFrame(characterId, animationName);
    }, [animationManager]);

    React.useEffect(() => {
        return () => {
            animationManager.stopAll();
        };
    }, [animationManager]);

    return {
        addAnimation,
        playAnimation,
        stopAnimation,
        getCurrentFrame
    };
};

export { AnimationManager, useAnimation };