/**
 * Neural Animation Controller for Neuralink Chip Section
 * Loads and displays 3D Neuralink chip model with neural network visualization
 */

class NeuralAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.animationId = null;
        
        // Three.js setup for 3D model
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.neuralinkModel = null;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize Three.js for 3D model
        this.initThreeJS();
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
    }
    
    initThreeJS() {
        // Get the neural overlay container for 3D model
        const container = document.querySelector('.neural-overlay');
        if (!container) return;
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // Clear existing content and add renderer
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x8a2be2, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00bfff, 1, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x8a2be2, 1, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
        
        // Load Neuralink chip model
        this.loadNeuralinkModel();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (!container) return;
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
    
    loadNeuralinkModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'neuralink_chip/scene.gltf',
            (gltf) => {
                this.neuralinkModel = gltf.scene;
                
                // Scale and position the model
                this.neuralinkModel.scale.set(2, 2, 2);
                this.neuralinkModel.position.set(0, 0, 0);
                
                // Add glow effect to materials
                this.neuralinkModel.traverse((child) => {
                    if (child.isMesh) {
                        child.material.emissive = new THREE.Color(0x00bfff);
                        child.material.emissiveIntensity = 0.3;
                    }
                });
                
                this.scene.add(this.neuralinkModel);
                console.log('Neuralink chip model loaded successfully!');
            },
            (progress) => {
                console.log('Loading Neuralink chip:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading Neuralink chip model:', error);
                // Create fallback geometry if model fails to load
                this.createFallbackChip();
            }
        );
    }
    
    createFallbackChip() {
        // Create a stylized chip if GLTF fails to load
        const geometry = new THREE.BoxGeometry(2, 0.3, 2);
        const material = new THREE.MeshPhongMaterial({
            color: 0x1a0a2e,
            emissive: 0x8a2be2,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        
        this.neuralinkModel = new THREE.Mesh(geometry, material);
        
        // Add circuit-like details
        const detailGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 100);
        const detailMaterial = new THREE.MeshPhongMaterial({
            color: 0x00bfff,
            emissive: 0x00bfff,
            emissiveIntensity: 0.8
        });
        
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);
        detail.rotation.x = Math.PI / 2;
        this.neuralinkModel.add(detail);
        
        this.scene.add(this.neuralinkModel);
        console.log('Using fallback Neuralink chip visualization');
    }
    
    animateThreeJS() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        // Rotate the model
        if (this.neuralinkModel) {
            this.neuralinkModel.rotation.y += 0.005;
            this.neuralinkModel.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
            
            // Floating animation
            this.neuralinkModel.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    createParticles() {
        const particleCount = 50;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(this.width, particle.x));
            particle.y = Math.max(0, Math.min(this.height, particle.y));
            
            // Pulse effect
            particle.pulsePhase += 0.02;
            particle.currentOpacity = particle.opacity + Math.sin(particle.pulsePhase) * 0.2;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            
            // Gradient fill
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 2
            );
            gradient.addColorStop(0, `rgba(138, 43, 226, ${particle.currentOpacity})`);
            gradient.addColorStop(0.5, `rgba(0, 191, 255, ${particle.currentOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    
                    // Create gradient line
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, `rgba(138, 43, 226, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(0, 191, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(138, 43, 226, ${opacity})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawNeuralPulses() {
        const time = Date.now() * 0.001;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Draw expanding rings
        for (let i = 0; i < 3; i++) {
            const phase = (time + i * 0.5) % 2;
            const radius = phase * 200;
            const opacity = (1 - phase / 2) * 0.2;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        this.drawNeuralPulses();
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize neural animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
        window.neuralAnimation = new NeuralAnimation('neuralCanvas');
    }
});
