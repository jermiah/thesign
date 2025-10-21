/**
 * Hero Robot with Sketchfab 3D Model
 * Loads and animates humanoid model from Sketchfab
 */

class HeroRobotSketchfab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.isHovering = false;
        this.animations = [];
        
        this.init();
    }
    
    async init() {
        this.setupScene();
        this.setupLights();
        await this.loadSketchfabModel();
        this.createEnvironment();
        this.createWelcomeText();
        this.setupInteraction();
        this.animate();
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050810);
        this.scene.fog = new THREE.FogExp2(0x050810, 0.02);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 4);
        this.camera.lookAt(0, 1.2, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x1a2a3a, 0.4);
        this.scene.add(ambientLight);
        
        // Key light (cyan from top-right)
        const keyLight = new THREE.DirectionalLight(0x00ffff, 2.5);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);
        
        // Fill light (blue from left)
        const fillLight = new THREE.DirectionalLight(0x0066ff, 1.5);
        fillLight.position.set(-5, 4, 3);
        this.scene.add(fillLight);
        
        // Rim light (bright cyan from behind)
        const rimLight = new THREE.DirectionalLight(0x00ffff, 2);
        rimLight.position.set(0, 4, -6);
        this.scene.add(rimLight);
        
        // Point lights for glow
        const glowLight1 = new THREE.PointLight(0x00ffff, 3, 10);
        glowLight1.position.set(0, 0, 2);
        this.scene.add(glowLight1);
        this.glowLight1 = glowLight1;
        
        const glowLight2 = new THREE.PointLight(0x0088ff, 2, 8);
        glowLight2.position.set(0, 3, 0);
        this.scene.add(glowLight2);
        this.glowLight2 = glowLight2;
        
        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0x0088ff, 0x001122, 0.6);
        this.scene.add(hemiLight);
    }
    
    async loadSketchfabModel() {
        return new Promise((resolve, reject) => {
            // Show loading message
            this.showLoadingMessage();
            
            // GLTFLoader
            const loader = new THREE.GLTFLoader();
            
            // Load the Sketchfab model
            // Note: You'll need to download the model and host it locally
            // or use Sketchfab's API with proper authentication
            const modelUrl = 'https://sketchfab.com/models/585069b447f842f582c223d64e377d94/download';
            
            // For demo purposes, we'll create a fallback humanoid
            // In production, replace this with actual model loading
            console.log('Loading Sketchfab model...');
            
            // Fallback: Create a stylized humanoid
            this.createStylizedHumanoid();
            this.hideLoadingMessage();
            resolve();
            
            /* 
            // Actual Sketchfab loading code (requires downloaded model):
            loader.load(
                'assets/avatar/humanoid.glb', // Place downloaded model here
                (gltf) => {
                    this.model = gltf.scene;
                    
                    // Scale and position
                    this.model.scale.set(1, 1, 1);
                    this.model.position.set(0, 0, 0);
                    
                    // Enable shadows
                    this.model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Enhance materials with glow
                            if (child.material) {
                                child.material.emissive = new THREE.Color(0x00ffff);
                                child.material.emissiveIntensity = 0.2;
                            }
                        }
                    });
                    
                    // Setup animations
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.mixer = new THREE.AnimationMixer(this.model);
                        this.animations = gltf.animations;
                        
                        // Play idle animation
                        const idleAnimation = this.animations[0];
                        const action = this.mixer.clipAction(idleAnimation);
                        action.play();
                    }
                    
                    this.scene.add(this.model);
                    this.hideLoadingMessage();
                    resolve();
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    console.log(`Loading: ${percent.toFixed(2)}%`);
                },
                (error) => {
                    console.error('Error loading model:', error);
                    this.createStylizedHumanoid();
                    this.hideLoadingMessage();
                    resolve();
                }
            );
            */
        });
    }
    
    createStylizedHumanoid() {
        // Create a stylized humanoid robot as fallback
        this.model = new THREE.Group();
        this.model.name = 'StylizedHumanoid';
        
        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.3
        });
        
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 2,
            transparent: true,
            opacity: 0.8
        });
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.7;
        head.castShadow = true;
        this.model.add(head);
        
        // Visor glow
        const visorGeometry = new THREE.BoxGeometry(0.3, 0.08, 0.02);
        const visor = new THREE.Mesh(visorGeometry, glowMaterial);
        visor.position.set(0, 1.72, 0.19);
        this.model.add(visor);
        this.visor = visor;
        
        // Torso
        const torsoGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 32);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.y = 1.2;
        torso.castShadow = true;
        this.model.add(torso);
        
        // Chest reactor
        const reactorGeometry = new THREE.SphereGeometry(0.12, 32, 32);
        const reactor = new THREE.Mesh(reactorGeometry, glowMaterial);
        reactor.position.set(0, 1.3, 0.22);
        this.model.add(reactor);
        this.reactor = reactor;
        
        // Arms
        [-0.35, 0.35].forEach((x, index) => {
            const armGroup = new THREE.Group();
            
            // Upper arm
            const upperArmGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.5, 16);
            const upperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
            upperArm.position.set(x, 1.25, 0);
            upperArm.rotation.z = x < 0 ? Math.PI / 8 : -Math.PI / 8;
            upperArm.castShadow = true;
            armGroup.add(upperArm);
            
            // Forearm
            const forearmGeometry = new THREE.CylinderGeometry(0.07, 0.08, 0.45, 16);
            const forearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
            forearm.position.set(x, 0.75, 0);
            forearm.castShadow = true;
            armGroup.add(forearm);
            
            // Hand with glow
            const handGeometry = new THREE.SphereGeometry(0.09, 16, 16);
            const hand = new THREE.Mesh(handGeometry, bodyMaterial);
            hand.position.set(x, 0.48, 0);
            hand.castShadow = true;
            armGroup.add(hand);
            
            const handGlow = new THREE.Mesh(
                new THREE.SphereGeometry(0.11, 16, 16),
                glowMaterial
            );
            handGlow.position.set(x, 0.48, 0);
            armGroup.add(handGlow);
            
            this.model.add(armGroup);
            
            if (index === 0) this.leftHandGlow = handGlow;
            else this.rightHandGlow = handGlow;
        });
        
        // Legs
        [-0.15, 0.15].forEach(x => {
            const legGroup = new THREE.Group();
            
            // Thigh
            const thighGeometry = new THREE.CylinderGeometry(0.11, 0.12, 0.5, 16);
            const thigh = new THREE.Mesh(thighGeometry, bodyMaterial);
            thigh.position.set(x, 0.65, 0);
            thigh.castShadow = true;
            legGroup.add(thigh);
            
            // Shin
            const shinGeometry = new THREE.CylinderGeometry(0.09, 0.1, 0.5, 16);
            const shin = new THREE.Mesh(shinGeometry, bodyMaterial);
            shin.position.set(x, 0.15, 0);
            shin.castShadow = true;
            legGroup.add(shin);
            
            // Foot
            const footGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.25);
            const foot = new THREE.Mesh(footGeometry, bodyMaterial);
            foot.position.set(x, -0.12, 0.05);
            foot.castShadow = true;
            legGroup.add(foot);
            
            // Foot glow
            const footGlow = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.14, 0.03, 32),
                glowMaterial
            );
            footGlow.position.set(x, -0.16, 0);
            legGroup.add(footGlow);
            
            this.model.add(legGroup);
        });
        
        this.scene.add(this.model);
    }
    
    createEnvironment() {
        // Holographic grid floor
        const gridSize = 20;
        const gridDivisions = 40;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0x003344);
        gridHelper.position.y = -0.5;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        
        // Circular platform
        const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 64);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x001122,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.48;
        platform.receiveShadow = true;
        this.scene.add(platform);
        this.platform = platform;
        
        // Glowing ring
        const ringGeometry = new THREE.TorusGeometry(1.5, 0.03, 16, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 3,
            transparent: true,
            opacity: 0.9
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.y = -0.45;
        ring.rotation.x = Math.PI / 2;
        this.scene.add(ring);
        this.platformRing = ring;
        
        // Particles
        this.createParticles();
    }
    
    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const positions = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }
    
    createWelcomeText() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 40;
        ctx.fillStyle = '#00ffff';
        ctx.fillText('WELCOME TO THE FUTURE OF CODING', canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        
        const textGeometry = new THREE.PlaneGeometry(8, 2);
        this.welcomeText = new THREE.Mesh(textGeometry, textMaterial);
        this.welcomeText.position.set(0, 3.5, 0);
        this.scene.add(this.welcomeText);
        
        this.animateTextAppearance();
    }
    
    animateTextAppearance() {
        let opacity = 0;
        const animate = () => {
            opacity += 0.02;
            if (opacity < 1) {
                this.welcomeText.material.opacity = opacity;
                requestAnimationFrame(animate);
            }
        };
        setTimeout(animate, 1000);
    }
    
    setupInteraction() {
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.targetRotation = this.mouse.x * 0.3;
        });
        
        this.container.addEventListener('mouseenter', () => {
            this.isHovering = true;
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        if (this.model) {
            // Smooth rotation
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.05;
            this.model.rotation.y = this.currentRotation;
            
            // Floating animation
            const floatOffset = Math.sin(elapsed * 0.8) * 0.15;
            this.model.position.y = floatOffset;
            
            // Glow pulse
            const glowIntensity = 1 + Math.sin(elapsed * 2) * 0.3;
            
            if (this.visor) {
                this.visor.material.emissiveIntensity = 2 * glowIntensity;
            }
            
            if (this.reactor) {
                this.reactor.material.emissiveIntensity = 2 * glowIntensity;
            }
            
            if (this.leftHandGlow) {
                const pulse = 1 + Math.sin(elapsed * 2) * 0.4;
                this.leftHandGlow.scale.set(pulse, pulse, pulse);
            }
            
            if (this.rightHandGlow) {
                const pulse = 1 + Math.sin(elapsed * 2 + Math.PI) * 0.4;
                this.rightHandGlow.scale.set(pulse, pulse, pulse);
            }
            
            // Hover effects
            if (this.isHovering) {
                if (this.glowLight1) {
                    this.glowLight1.intensity = 3 + Math.sin(elapsed * 3) * 1;
                }
            } else {
                if (this.glowLight1) {
                    this.glowLight1.intensity = 3;
                }
            }
        }
        
        // Platform rotation
        if (this.platform) {
            this.platform.rotation.y += 0.002;
        }
        
        if (this.platformRing) {
            this.platformRing.rotation.z += 0.005;
            const ringPulse = 1 + Math.sin(elapsed * 2) * 0.2;
            this.platformRing.material.emissiveIntensity = 3 * ringPulse;
        }
        
        // Particles
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
        }
        
        // Text flicker
        if (this.welcomeText) {
            const flicker = 0.9 + Math.random() * 0.1;
            this.welcomeText.material.opacity = Math.min(1, this.welcomeText.material.opacity * flicker);
        }
        
        // Camera movement
        this.camera.position.x = Math.sin(elapsed * 0.2) * 0.5;
        this.camera.position.y = 1.6 + Math.cos(elapsed * 0.3) * 0.3;
        this.camera.lookAt(0, 1.2, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    showLoadingMessage() {
        console.log('Loading 3D model...');
    }
    
    hideLoadingMessage() {
        console.log('Model loaded successfully!');
    }
    
    onWindowResize() {
        if (!this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
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

// Export
window.HeroRobotSketchfab = HeroRobotSketchfab;
window.HeroRobot = HeroRobotSketchfab; // Alias for compatibility
