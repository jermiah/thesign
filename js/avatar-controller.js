/**
 * Avatar Controller for Sign Language Communication
 * Manages 3D avatar rendering and sign language animations
 */

class AvatarController {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.isEnabled = false;
        this.currentAnimation = null;
        this.animationQueue = [];
        this.isAnimating = false;
        
        // Sign language animation library
        this.signAnimations = new SignAnimations();
    }
    
    async initialize() {
        try {
            console.log('Initializing avatar system...');
            
            // Setup Three.js scene
            this.setupScene();
            this.setupLights();
            await this.loadAvatar();
            this.animate();
            
            console.log('Avatar system initialized successfully!');
            return true;
        } catch (error) {
            console.error('Error initializing avatar:', error);
            return false;
        }
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 3);
        this.camera.lookAt(0, 1.4, 0);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (key light)
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
        keyLight.position.set(2, 3, 2);
        keyLight.castShadow = true;
        this.scene.add(keyLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-2, 2, -2);
        this.scene.add(fillLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
        rimLight.position.set(0, 2, -3);
        this.scene.add(rimLight);
    }
    
    async loadAvatar() {
        // Create a simple humanoid avatar using Three.js primitives
        // In production, you would load a GLB/GLTF model
        this.avatar = this.createSimpleAvatar();
        this.scene.add(this.avatar);
        
        // Setup animation mixer
        this.mixer = new THREE.AnimationMixer(this.avatar);
    }
    
    createSimpleAvatar() {
        const avatar = new THREE.Group();
        avatar.name = 'SignLanguageAvatar';
        
        // Materials
        const skinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffdbac,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const clothMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.9
        });
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.y = 1.65;
        head.castShadow = true;
        head.name = 'head';
        avatar.add(head);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.05, 1.68, 0.12);
        avatar.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.05, 1.68, 0.12);
        avatar.add(rightEye);
        
        // Torso
        const torsoGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 32);
        const torso = new THREE.Mesh(torsoGeometry, clothMaterial);
        torso.position.y = 1.25;
        torso.castShadow = true;
        torso.name = 'torso';
        avatar.add(torso);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16);
        
        // Left arm
        const leftArm = new THREE.Group();
        leftArm.name = 'leftArm';
        const leftUpperArm = new THREE.Mesh(armGeometry, clothMaterial);
        leftUpperArm.position.set(-0.22, 1.3, 0);
        leftUpperArm.rotation.z = Math.PI / 6;
        leftUpperArm.castShadow = true;
        leftArm.add(leftUpperArm);
        avatar.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Group();
        rightArm.name = 'rightArm';
        const rightUpperArm = new THREE.Mesh(armGeometry, clothMaterial);
        rightUpperArm.position.set(0.22, 1.3, 0);
        rightUpperArm.rotation.z = -Math.PI / 6;
        rightUpperArm.castShadow = true;
        rightArm.add(rightUpperArm);
        avatar.add(rightArm);
        
        // Hands
        const handGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        
        const leftHand = new THREE.Mesh(handGeometry, skinMaterial);
        leftHand.position.set(-0.3, 1.05, 0);
        leftHand.castShadow = true;
        leftHand.name = 'leftHand';
        avatar.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeometry, skinMaterial);
        rightHand.position.set(0.3, 1.05, 0);
        rightHand.castShadow = true;
        rightHand.name = 'rightHand';
        avatar.add(rightHand);
        
        return avatar;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Process animation queue
        if (!this.isAnimating && this.animationQueue.length > 0) {
            const nextAnimation = this.animationQueue.shift();
            this.playAnimation(nextAnimation);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    /**
     * Sign a message using sign language animations
     */
    async signMessage(message) {
        console.log('Avatar signing:', message);
        
        const words = message.toUpperCase().split(' ');
        
        for (const word of words) {
            // Check if we have a word animation
            if (this.signAnimations.hasWordAnimation(word)) {
                await this.queueAnimation('word', word);
            } else {
                // Spell out letter by letter
                for (const letter of word) {
                    if (this.signAnimations.hasLetterAnimation(letter)) {
                        await this.queueAnimation('letter', letter);
                    }
                }
            }
            
            // Add pause between words
            await this.queueAnimation('pause', 500);
        }
    }
    
    async queueAnimation(type, value) {
        return new Promise((resolve) => {
            this.animationQueue.push({
                type: type,
                value: value,
                callback: resolve
            });
        });
    }
    
    async playAnimation(animationData) {
        this.isAnimating = true;
        
        try {
            if (animationData.type === 'letter') {
                await this.performLetterSign(animationData.value);
            } else if (animationData.type === 'word') {
                await this.performWordSign(animationData.value);
            } else if (animationData.type === 'pause') {
                await this.pause(animationData.value);
            }
        } catch (error) {
            console.error('Animation error:', error);
        }
        
        this.isAnimating = false;
        
        if (animationData.callback) {
            animationData.callback();
        }
    }
    
    async performLetterSign(letter) {
        const animation = this.signAnimations.getLetterAnimation(letter);
        
        if (!animation || !this.avatar) return;
        
        const leftHand = this.avatar.getObjectByName('leftHand');
        const rightHand = this.avatar.getObjectByName('rightHand');
        const head = this.avatar.getObjectByName('head');
        
        // Animate to sign position
        await this.animateToPosition(rightHand, animation.rightHand, 500);
        
        if (animation.leftHand) {
            await this.animateToPosition(leftHand, animation.leftHand, 500);
        }
        
        // Hold the sign
        await this.pause(800);
        
        // Return to neutral
        await this.returnToNeutral();
    }
    
    async performWordSign(word) {
        const animation = this.signAnimations.getWordAnimation(word);
        
        if (!animation) {
            // Fallback to spelling
            for (const letter of word) {
                await this.performLetterSign(letter);
            }
            return;
        }
        
        // Perform word-specific animation
        // This would be more complex in production
        await this.performLetterSign(word[0]);
    }
    
    async animateToPosition(object, targetPos, duration) {
        if (!object || !targetPos) return;
        
        const startPos = {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z
        };
        
        const startTime = Date.now();
        
        return new Promise((resolve) => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-in-out)
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                object.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
                object.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
                object.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    async returnToNeutral() {
        const leftHand = this.avatar.getObjectByName('leftHand');
        const rightHand = this.avatar.getObjectByName('rightHand');
        
        await Promise.all([
            this.animateToPosition(leftHand, { x: -0.3, y: 1.05, z: 0 }, 300),
            this.animateToPosition(rightHand, { x: 0.3, y: 1.05, z: 0 }, 300)
        ]);
    }
    
    async pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    enable() {
        this.isEnabled = true;
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
    
    disable() {
        this.isEnabled = false;
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Export for use in main application
window.AvatarController = AvatarController;
