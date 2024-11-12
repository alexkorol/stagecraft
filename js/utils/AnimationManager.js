class AnimationManager {
    constructor() {
        this.animations = new Map(); // characterId -> animation state
        this.lastFrameTime = performance.now();
        this.isRunning = false;
    }

    // Add or update an animation for a character
    setAnimation(characterId, {
        frames,
        frameRate = 8,
        loop = true,
        onComplete = null,
        transitionDuration = 200 // ms for movement transitions
    }) {
        this.animations.set(characterId, {
            frames,
            frameRate,
            loop,
            onComplete,
            currentFrame: 0,
            lastFrameChange: performance.now(),
            frameDuration: 1000 / frameRate,
            transitionDuration,
            isTransitioning: false,
            startPosition: null,
            targetPosition: null,
            transitionStartTime: null
        });
    }

    // Remove an animation
    removeAnimation(characterId) {
        this.animations.delete(characterId);
    }

    // Start a position transition
    startTransition(characterId, startPos, targetPos) {
        const animation = this.animations.get(characterId);
        if (!animation) return;

        animation.isTransitioning = true;
        animation.startPosition = startPos;
        animation.targetPosition = targetPos;
        animation.transitionStartTime = performance.now();
    }

    // Get current frame for a character
    getCurrentFrame(characterId) {
        const animation = this.animations.get(characterId);
        if (!animation || !animation.frames) return null;
        return animation.frames[animation.currentFrame];
    }

    // Get interpolated position during transition
    getInterpolatedPosition(characterId) {
        const animation = this.animations.get(characterId);
        if (!animation || !animation.isTransitioning) return null;

        const currentTime = performance.now();
        const elapsed = currentTime - animation.transitionStartTime;
        const progress = Math.min(elapsed / animation.transitionDuration, 1);

        // Smooth easing function
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        const startPos = animation.startPosition;
        const targetPos = animation.targetPosition;

        if (progress >= 1) {
            animation.isTransitioning = false;
            return targetPos;
        }

        return {
            x: startPos.x + (targetPos.x - startPos.x) * easeProgress,
            y: startPos.y + (targetPos.y - startPos.y) * easeProgress
        };
    }

    // Update all animations
    update(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.animations.forEach((animation, characterId) => {
            // Update frame animation
            if (animation.frames && animation.frames.length > 1) {
                if (timestamp - animation.lastFrameChange >= animation.frameDuration) {
                    animation.currentFrame++;
                    if (animation.currentFrame >= animation.frames.length) {
                        if (animation.loop) {
                            animation.currentFrame = 0;
                        } else {
                            animation.currentFrame = animation.frames.length - 1;
                            if (animation.onComplete) {
                                animation.onComplete();
                            }
                        }
                    }
                    animation.lastFrameChange = timestamp;
                }
            }
        });
    }

    // Start animations
    start() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
    }

    // Stop animations
    stop() {
        this.isRunning = false;
    }

    // Reset all animations
    reset() {
        this.animations.forEach(animation => {
            animation.currentFrame = 0;
            animation.lastFrameChange = performance.now();
            animation.isTransitioning = false;
        });
    }

    // Create a simple movement animation
    createMovementAnimation(frames, direction) {
        return {
            frames,
            frameRate: 8,
            loop: true,
            direction
        };
    }

    // Create a sprite sheet animation
    createSpriteSheetAnimation(spriteSheet, frameWidth, frameHeight, sequence) {
        const frames = sequence.map(index => {
            const row = Math.floor(index / (spriteSheet.width / frameWidth));
            const col = index % (spriteSheet.width / frameWidth);
            return {
                x: col * frameWidth,
                y: row * frameHeight,
                width: frameWidth,
                height: frameHeight
            };
        });

        return {
            frames,
            frameRate: 8,
            loop: true
        };
    }

    // Helper method to create a transition between two sprites
    createTransition(fromSprite, toSprite, steps = 5) {
        const frames = [];
        
        // Ensure sprites are the same size
        if (fromSprite.length !== toSprite.length || 
            fromSprite[0].length !== toSprite[0].length) {
            throw new Error('Sprites must be the same size for transition');
        }

        for (let step = 0; step <= steps; step++) {
            const progress = step / steps;
            const frame = fromSprite.map((row, y) =>
                row.map((fromPixel, x) => {
                    if (fromPixel === toSprite[y][x]) return fromPixel;
                    return progress < 0.5 ? fromPixel : toSprite[y][x];
                })
            );
            frames.push(frame);
        }

        return {
            frames,
            frameRate: 12,
            loop: false
        };
    }
}

export default new AnimationManager();
