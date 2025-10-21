/**
 * Hyper-Realistic 3D Robot Avatar for Hero Section
 * Chrome-black exosuit with glowing blue/cyan highlights
 */

class HeroRobot {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.isHovering = false;
        this.pulseTime = 0;
        this.floatOffset = 0;
        this.glowIntensity = 1;
        
        this.init();
    }
    
    async init() {
        this.setupScene();
        this.setupLights();
        this.createRobot();
        this.createEnvironment();
        this.createWelcomeText();
        this.setupInteraction();
        this.animate();
    }
    
    setupScene() {
        // Scene with fog
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
        this.camera.position.set(0, 2, 6);
        this.camera.lookAt(0, 1.5, 0);
        
        // Renderer with advanced settings
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
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x1a2a3a, 0.3);
        this.scene.add(ambientLight);
        
        // Key light (cyan from top-right)
        const keyLight = new THREE.DirectionalLight(0x00ffff, 2);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        this.scene.add(keyLight);
        
        // Fill light (blue from left)
        const fillLight = new THREE.DirectionalLight(0x0066ff, 1.2);
        fillLight.position.set(-5, 4, 3);
        this.scene.add(fillLight);
        
        // Rim light (bright cyan from behind)
        const rimLight = new THREE.DirectionalLight(0x00ffff, 1.8);
        rimLight.position.set(0, 4, -6);
        this.scene.add(rimLight);
        
        // Point lights for glow effects
        const glowLight1 = new THREE.PointLight(0x00ffff, 3, 8);
        glowLight1.position.set(0, 0, 2);
        this.scene.add(glowLight1);
        this.glowLight1 = glowLight1;
        
        const glowLight2 = new THREE.PointLight(0x0088ff, 2, 6);
        glowLight2.position.set(0, 3, 0);
        this.scene.add(glowLight2);
        this.glowLight2 = glowLight2;
        
        // Hemisphere light for ambient color
        const hemiLight = new THREE.HemisphereLight(0x0088ff, 0x001122, 0.6);
        this.scene.add(hemiLight);
    }
    
    createRobot() {
        this.robot = new THREE.Group();
        this.robot.name = 'HeroRobot';
        
        // PBR Materials
        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 1.0,
            roughness: 0.1,
            envMapIntensity: 2.0
        });
        
        const armorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.95,
            roughness: 0.2,
            envMapIntensity: 1.8
        });
        
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 3,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.9
        });
        
        const cyanGlowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ccff,
            emissive: 0x00ccff,
            emissiveIntensity: 2.5,
            metalness: 0.8,
            roughness: 0.15
        });
        
        // HEAD/HELMET
        const headGroup = new THREE.Group();
        
        // Main helmet
        const helmetGeometry = new THREE.SphereGeometry(0.28, 32, 32);
        const helmet = new THREE.Mesh(helmetGeometry, chromeMaterial);
        helmet.scale.set(1, 1.15, 0.95);
        helmet.position.y = 2.3;
        helmet.castShadow = true;
        headGroup.add(helmet);
        
        // Visor (glowing cyan)
        const visorGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.02);
        const visor = new THREE.Mesh(visorGeometry, glowMaterial);
        visor.position.set(0, 2.32, 0.26);
        headGroup.add(visor);
        this.visor = visor;
        
        // Helmet crest
        const crestGeometry = new THREE.BoxGeometry(0.35, 0.18, 0.28);
        const crest = new THREE.Mesh(crestGeometry, armorMaterial);
        crest.position.set(0, 2.42, 0);
        headGroup.add(crest);
        
        // Side helmet details with glow
        [-0.22, 0.22].forEach(x => {
            const sideDetail = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16),
                cyanGlowMaterial
            );
            sideDetail.position.set(x, 2.3, 0.1);
            sideDetail.rotation.z = Math.PI / 2;
            headGroup.add(sideDetail);
        });
        
        this.robot.add(headGroup);
        this.headGroup = headGroup;
        
        // TORSO
        const torsoGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.35);
        const torso = new THREE.Mesh(torsoGeometry, chromeMaterial);
        torso.position.y = 1.5;
        torso.castShadow = true;
        this.robot.add(torso);
        
        // Chest core (glowing reactor)
        const coreGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const core = new THREE.Mesh(coreGeometry, glowMaterial);
        core.position.set(0, 1.6, 0.19);
        this.robot.add(core);
        this.core = core;
        
        // Chest armor plates
        const chestPlateGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.05);
        const chestPlate = new THREE.Mesh(chestPlateGeometry, armorMaterial);
        chestPlate.position.set(0, 1.7, 0.18);
        this.robot.add(chestPlate);
        
        // SHOULDERS
        [-0.42, 0.42].forEach(x => {
            const shoulderGroup = new THREE.Group();
            
            // Main shoulder
            const shoulderGeometry = new THREE.SphereGeometry(0.18, 32, 32);
            const shoulder = new THREE.Mesh(shoulderGeometry, armorMaterial);
            shoulder.scale.set(1.2, 1, 1);
            shoulder.position.set(x, 1.9, 0);
            shoulder.castShadow = true;
            shoulderGroup.add(shoulder);
            
            // Shoulder glow ring
            const ringGeometry = new THREE.TorusGeometry(0.12, 0.03, 16, 32);
            const ring = new THREE.Mesh(ringGeometry, cyanGlowMaterial);
            ring.position.set(x, 1.9, 0);
            ring.rotation.x = Math.PI / 2;
            shoulderGroup.add(ring);
            
            // Shoulder armor plates
            const plateGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.2);
            const plate = new THREE.Mesh(plateGeometry, chromeMaterial);
            plate.position.set(x, 2, 0);
            shoulderGroup.add(plate);
            
            this.robot.add(shoulderGroup);
        });
        
        // ARMS
        this.arms = [];
        [-0.42, 0.42].forEach((x, index) => {
            const armGroup = new THREE.Group();
            
            // Upper arm
            const upperArmGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.6, 16);
            const upperArm = new THREE.Mesh(upperArmGeometry, chromeMaterial);
            upperArm.position.set(x, 1.45, 0);
            upperArm.castShadow = true;
            armGroup.add(upperArm);
            
            // Elbow joint with glow
            const elbowGeometry = new THREE.SphereGeometry(0.12, 16, 16);
            const elbow = new THREE.Mesh(elbowGeometry, armorMaterial);
            elbow.position.set(x, 1.15, 0);
            armGroup.add(elbow);
            
            const elbowGlow = new THREE.Mesh(
                new THREE.RingGeometry(0.08, 0.11, 32),
                cyanGlowMaterial
            );
            elbowGlow.position.set(x, 1.15, 0.1);
            armGroup.add(elbowGlow);
            
            // Forearm
            const forearmGeometry = new THREE.CylinderGeometry(0.09, 0.11, 0.5, 16);
            const forearm = new THREE.Mesh(forearmGeometry, chromeMaterial);
            forearm.position.set(x, 0.85, 0);
            forearm.castShadow = true;
            armGroup.add(forearm);
            
            // Hand/Fist
            const handGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.15);
            const hand = new THREE.Mesh(handGeometry, armorMaterial);
            hand.position.set(x, 0.55, 0);
            hand.castShadow = true;
            armGroup.add(hand);
            
            // Energy glow from fist
            const fistGlowGeometry = new THREE.SphereGeometry(0.12, 16, 16);
            const fistGlow = new THREE.Mesh(fistGlowGeometry, glowMaterial);
            fistGlow.position.set(x, 0.55, 0);
            fistGlow.scale.set(1, 1.2, 1);
            armGroup.add(fistGlow);
            
            this.robot.add(armGroup);
            this.arms.push({ group: armGroup, fistGlow: fistGlow });
        });
        
        // WAIST/BELT
        const beltGeometry = new THREE.CylinderGeometry(0.32, 0.35, 0.15, 32);
        const belt = new THREE.Mesh(beltGeometry, armorMaterial);
        belt.position.y = 1.05;
        this.robot.add(belt);
        
        // Belt glow line
        const beltGlowGeometry = new THREE.TorusGeometry(0.33, 0.02, 16, 32);
        const beltGlow = new THREE.Mesh(beltGlowGeometry, cyanGlowMaterial);
        beltGlow.position.y = 1.05;
        beltGlow.rotation.x = Math.PI / 2;
        this.robot.add(beltGlow);
        
        // LEGS
        [-0.18, 0.18].forEach(x => {
            const legGroup = new THREE.Group();
            
            // Thigh
            const thighGeometry = new THREE.CylinderGeometry(0.13, 0.15, 0.55, 16);
            const thigh = new THREE.Mesh(thighGeometry, chromeMaterial);
            thigh.position.set(x, 0.7, 0);
            thigh.castShadow = true;
            legGroup.add(thigh);
            
            // Knee joint
            const kneeGeometry = new THREE.SphereGeometry(0.14, 16, 16);
            const knee = new THREE.Mesh(kneeGeometry, armorMaterial);
            knee.position.set(x, 0.42, 0);
            legGroup.add(knee);
            
            const kneeGlow = new THREE.Mesh(
                new THREE.RingGeometry(0.09, 0.12, 32),
                cyanGlowMaterial
            );
            kneeGlow.position.set(x, 0.42, 0.12);
            legGroup.add(kneeGlow);
            
            // Shin
            const shinGeometry = new THREE.CylinderGeometry(0.11, 0.13, 0.5, 16);
            const shin = new THREE.Mesh(shinGeometry, chromeMaterial);
            shin.position.set(x, 0.15, 0);
            shin.castShadow = true;
            legGroup.add(shin);
            
            // Foot/Boot
            const footGeometry = new THREE.BoxGeometry(0.18, 0.12, 0.28);
            const foot = new THREE.Mesh(footGeometry, armorMaterial);
            foot.position.set(x, -0.08, 0.05);
            foot.castShadow = true;
            legGroup.add(foot);
            
            // Energy pulse from feet
            const footGlowGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.05, 32);
            const footGlow = new THREE.Mesh(footGlowGeometry, glowMaterial);
            footGlow.position.set(x, -0.14, 0);
            legGroup.add(footGlow);
            
            this.robot.add(legGroup);
        });
        
        // Position robot
        this.robot.position.y = 0.5;
        this.scene.add(this.robot);
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
        
        // Circular platform under robot
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
        
        // Glowing ring around platform
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
        
        // Particle system for ambient effect
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
        // Create canvas for text
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Draw text with glow effect
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Glow effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 40;
        ctx.fillStyle = '#00ffff';
        ctx.fillText('WELCOME TO THE FUTURE OF CODING', canvas.width / 2, canvas.height / 2);
        
        // Create texture and material
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        
        const textGeometry = new THREE.PlaneGeometry(8, 2);
        this.welcomeText = new THREE.Mesh(textGeometry, textMaterial);
        this.welcomeText.position.set(0, 4, 0);
        this.scene.add(this.welcomeText);
        
        // Animate text appearance
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
        // Mouse move for camera orbit
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.targetRotation = this.mouse.x * 0.3;
        });
        
        // Hover detection
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
        
        if (this.robot) {
            // Smooth rotation based on mouse
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.05;
            this.robot.rotation.y = this.currentRotation;
            
            // Floating animation
            this.floatOffset = Math.sin(elapsed * 0.8) * 0.15;
            this.robot.position.y = 0.5 + this.floatOffset;
            
            // Breathing effect (scale)
            const breathe = 1 + Math.sin(elapsed * 1.5) * 0.02;
            if (this.headGroup) {
                this.headGroup.scale.y = breathe;
            }
            
            // Pulse glow intensity
            this.glowIntensity = 1 + Math.sin(elapsed * 2) * 0.3;
            
            if (this.core) {
                this.core.material.emissiveIntensity = 3 * this.glowIntensity;
            }
            
            if (this.visor) {
                this.visor.material.emissiveIntensity = 3 * this.glowIntensity;
            }
            
            // Fist glow pulse
            this.arms.forEach((arm, index) => {
                const offset = index * Math.PI;
                const pulse = 1 + Math.sin(elapsed * 2 + offset) * 0.4;
                arm.fistGlow.scale.set(pulse, pulse * 1.2, pulse);
                arm.fistGlow.material.emissiveIntensity = 3 * pulse;
            });
            
            // Hover effect - enhanced glow
            if (this.isHovering) {
                if (this.glowLight1) {
                    this.glowLight1.intensity = 3 + Math.sin(elapsed * 3) * 1;
                }
                if (this.glowLight2) {
                    this.glowLight2.intensity = 2 + Math.sin(elapsed * 3) * 0.5;
                }
            } else {
                if (this.glowLight1) {
                    this.glowLight1.intensity = 3;
                }
                if (this.glowLight2) {
                    this.glowLight2.intensity = 2;
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
        
        // Particles animation
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(elapsed + i) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Text scanline effect
        if (this.welcomeText) {
            const flicker = 0.9 + Math.random() * 0.1;
            this.welcomeText.material.opacity = Math.min(1, this.welcomeText.material.opacity * flicker);
        }
        
        // Camera subtle movement
        this.camera.position.x = Math.sin(elapsed * 0.2) * 0.5;
        this.camera.position.y = 2 + Math.cos(elapsed * 0.3) * 0.3;
        this.camera.lookAt(0, 1.5, 0);
        
        this.renderer.render(this.scene, this.camera);
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

// Export for use in main application
window.HeroRobot = HeroRobot;
