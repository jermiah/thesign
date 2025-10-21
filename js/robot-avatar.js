/**
 * Futuristic Robot Avatar with 3D Animation
 * Chrome-black exosuit with glowing blue/cyan highlights
 */

class RobotAvatar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.isHovering = false;
        this.pulseTime = 0;
        
        this.init();
    }
    
    async init() {
        this.setupScene();
        this.setupLights();
        this.createRobot();
        this.createEnvironment();
        this.setupInteraction();
        this.animate();
        this.showWelcomeText();
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0f1a);
        this.scene.fog = new THREE.Fog(0x0a0f1a, 5, 15);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            50,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 1.5, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x1a3a52, 0.4);
        this.scene.add(ambientLight);
        
        // Key light (cyan)
        const keyLight = new THREE.DirectionalLight(0x00ffff, 1.5);
        keyLight.position.set(3, 5, 3);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);
        
        // Fill light (blue)
        const fillLight = new THREE.DirectionalLight(0x0066ff, 0.8);
        fillLight.position.set(-3, 3, -2);
        this.scene.add(fillLight);
        
        // Rim light (bright cyan)
        const rimLight = new THREE.DirectionalLight(0x00ffff, 1.2);
        rimLight.position.set(0, 3, -5);
        this.scene.add(rimLight);
        
        // Point lights for glow effect
        const glowLight1 = new THREE.PointLight(0x00ffff, 2, 5);
        glowLight1.position.set(0, 0.5, 1);
        this.scene.add(glowLight1);
        
        const glowLight2 = new THREE.PointLight(0x0066ff, 1.5, 4);
        glowLight2.position.set(0, 2, 0);
        this.scene.add(glowLight2);
    }
    
    createRobot() {
        this.robot = new THREE.Group();
        this.robot.name = 'FuturisticRobot';
        
        // Materials
        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.95,
            roughness: 0.15,
            envMapIntensity: 1.5
        });
        
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 2,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const armorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.9,
            roughness: 0.3,
            envMapIntensity: 1.2
        });
        
        // Head/Helmet
        const headGroup = new THREE.Group();
        const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const head = new THREE.Mesh(headGeometry, chromeMaterial);
        head.scale.set(1, 1.1, 0.9);
        head.position.y = 2.2;
