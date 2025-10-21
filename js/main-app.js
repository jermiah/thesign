/**
 * Main Application Controller
 * Integrates all components: Sign Language Recognition, Avatar, Requirement Flow, and Code Generation
 */

class SignLanguageApp {
    constructor() {
        // Core components
        this.recognition = new EnhancedSignLanguageRecognition();
        this.avatar = null;
        this.requirementFlow = null;
        this.blackboxAPI = new BlackboxAPI();
        this.appGenerator = new AppGenerator(this.blackboxAPI);
        this.previewManager = new PreviewManager('livePreview', 'codeView');
        
        // State
        this.isAvatarEnabled = false;
        this.isRecognitionActive = false;
        this.currentRequirements = null;
        this.messageCount = 0;
        
        // MediaPipe
        this.hands = null;
        this.camera = null;
        this.stream = null;
        
        // Detected text
        this.detectedLetters = [];
        this.recognizedText = '';
        this.lastDetectionTime = 0;
        this.currentGesture = '';
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Sign Language App...');
        
        // Load recognition model
        await this.recognition.loadModel();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('App initialized successfully!');
    }
    
    setupEventListeners() {
        // Auto-focus input
        document.getElementById('messageInput')?.focus();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }
    
    // ==================== AVATAR MANAGEMENT ====================
    
    async toggleAvatar(enabled) {
        this.isAvatarEnabled = enabled;
        const avatarContainer = document.getElementById('avatarContainer');
        const avatarToggle = document.getElementById('avatarToggle');
        
        if (enabled) {
            avatarContainer.style.display = 'block';
            avatarToggle.checked = true;
            
            if (!this.avatar) {
                this.avatar = new AvatarController('avatarCanvas');
                await this.avatar.initialize();
                this.requirementFlow = new RequirementFlow(this.avatar);
            }
            
            this.avatar.enable();
            await this.avatar.signMessage('HELLO');
            
        } else {
            avatarContainer.style.display = 'none';
            avatarToggle.checked = false;
            
            if (this.avatar) {
                this.avatar.disable();
            }
        }
    }
    
    // ==================== SIGN LANGUAGE RECOGNITION ====================
    
    async toggleSignLanguage() {
        const modal = document.getElementById('videoModal');
        const cameraBtn = document.getElementById('cameraBtn');
        
        if (modal.classList.contains('active')) {
            this.closeSignLanguage();
        } else {
            modal.classList.add('active');
            cameraBtn.classList.add('active');
            await this.initializeMediaPipe();
        }
    }
    
    async initializeMediaPipe() {
        try {
            document.getElementById('recognitionStatus').innerHTML = 
                '<span class="loading-spinner"></span> Initializing Enhanced Recognition System...';
            
            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7
            });

            this.hands.onResults((results) => this.onHandsResults(results));

            // Setup camera
            const videoElement = document.getElementById('videoElement');
            const canvasElement = document.getElementById('canvasElement');
            
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            });
            
            videoElement.srcObject = this.stream;
            
            await new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    canvasElement.width = videoElement.videoWidth;
                    canvasElement.height = videoElement.videoHeight;
                    resolve();
                };
            });

            this.camera = new Camera(videoElement, {
                onFrame: async () => {
                    if (this.isRecognitionActive) {
                        await this.hands.send({image: videoElement});
                    }
                },
                width: 640,
                height: 480
            });

            await this.camera.start();
            
            document.getElementById('recognitionStatus').textContent = 
                'Enhanced recognition ready! Click "Start Recognition" to begin.';
            document.getElementById('startRecognition').disabled = false;
            document.getElementById('startRecognition').innerHTML = 'Start Recognition';
            
        } catch (error) {
            console.error('Error initializing MediaPipe:', error);
            document.getElementById('recognitionStatus').textContent = 
                'Error: ' + error.message + '. Please check camera permissions.';
        }
    }
    
    onHandsResults(results) {
        const canvasElement = document.getElementById('canvasElement');
        const canvasCtx = canvasElement.getContext('2d');
        
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, 
                    {color: '#00FF00', lineWidth: 2});
                drawLandmarks(canvasCtx, landmarks, 
                    {color: '#FF0000', lineWidth: 1, radius: 3});
                
                // Use enhanced recognition
                const gesture = this.recognition.recognizeGesture(landmarks);
                if (gesture) {
                    this.updateDetectedText(gesture);
                }
            }
        }
        
        canvasCtx.restore();
    }
    
    updateDetectedText(gesture) {
        const currentTime = Date.now();
        
        if (currentTime - this.lastDetectionTime > 1500) {
            const value = gesture.type === 'word' ? gesture.value : gesture.value;
            
            if (value !== this.currentGesture) {
                if (gesture.type === 'word') {
                    this.detectedLetters.push(' ' + value + ' ');
                } else {
                    this.detectedLetters.push(value);
                }
                
                this.currentGesture = value;
                this.lastDetectionTime = currentTime;
                
                this.recognizedText = this.detectedLetters.join('');
                const detectedTextElement = document.getElementById('detectedText');
                detectedTextElement.textContent = this.recognizedText || 'Detected signs will appear here...';
                detectedTextElement.classList.toggle('empty', !this.recognizedText);
                
                this.updateConfidence(gesture.confidence * 100);
            }
        }
    }
    
    updateConfidence(value) {
        document.getElementById('confidenceValue').textContent = Math.round(value) + '%';
        document.getElementById('confidenceFill').style.width = value + '%';
    }
    
    startRecognition() {
        this.isRecognitionActive = true;
        this.detectedLetters = [];
        this.recognizedText = '';
        this.currentGesture = '';
        this.lastDetectionTime = 0;
        
        document.getElementById('startRecognition').style.display = 'none';
        document.getElementById('stopRecognition').style.display = 'block';
        
        const statusElement = document.getElementById('recognitionStatus');
        statusElement.classList.add('active');
        statusElement.textContent = '🟢 Enhanced recognition active - Show ASL signs';
        
        document.getElementById('detectedText').textContent = 'Waiting for signs...';
        document.getElementById('detectedText').classList.remove('empty');
    }
    
    stopRecognition() {
        this.isRecognitionActive = false;
        
        document.getElementById('startRecognition').style.display = 'block';
        document.getElementById('stopRecognition').style.display = 'none';
        
        const statusElement = document.getElementById('recognitionStatus');
        statusElement.classList.remove('active');
        statusElement.textContent = 'Recognition stopped.';
        
        this.updateConfidence(0);
    }
    
    closeSignLanguage() {
        const modal = document.getElementById('videoModal');
        const cameraBtn = document.getElementById('cameraBtn');
        
        modal.classList.remove('active');
        cameraBtn.classList.remove('active');
        
        if (this.isRecognitionActive) {
            this.stopRecognition();
        }
        
        if (this.camera) {
            this.camera.stop();
            this.camera = null;
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.hands) {
            this.hands.close();
            this.hands = null;
        }
    }
    
    openSignLanguage() {
        this.toggleSignLanguage();
    }
    
    sendDetectedText() {
        if (this.recognizedText) {
            document.getElementById('messageInput').value = this.recognizedText;
            this.closeSignLanguage();
            document.getElementById('messageInput').focus();
        }
    }
    
    // ==================== CHAT FUNCTIONALITY ====================
    
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.remove();
        }
        
        this.addMessage('user', message);
        input.value = '';
        input.style.height = 'auto';
        
        this.showTypingIndicator();
        
        // Send to Blackbox AI
        const response = await this.blackboxAPI.sendMessage(message);
        
        this.hideTypingIndicator();
        
        if (response.success) {
            this.addMessage('ai', response.response);
            
            // Avatar signs the response if enabled
            if (this.isAvatarEnabled && this.avatar) {
                await this.avatar.signMessage(this.extractKeyWords(response.response));
            }
        } else {
            this.addMessage('ai', 'Sorry, I encountered an error. Please try again.');
        }
    }
    
    extractKeyWords(text) {
        // Extract first few words for avatar to sign
        const words = text.split(' ').slice(0, 5).join(' ');
        return words;
    }
    
    addMessage(type, content) {
        const messagesContainer = document.getElementById('messagesContainer');
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'user' ? 'U' : 'B'}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${type === 'user' ? 'You' : 'BLACKBOX AI'}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${this.formatMessage(content)}</div>
                ${type === 'ai' ? `
                    <div class="message-actions">
                        <button class="action-btn" onclick="app.copyMessage(this)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.messageCount++;
    }
    
    formatMessage(content) {
        // Basic markdown-like formatting
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\n/g, '<br>');
        return content;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('messagesContainer');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">B</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    copyMessage(button) {
        const messageText = button.closest('.message-content').querySelector('.message-text').innerText;
        navigator.clipboard.writeText(messageText).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 2000);
        });
    }
    
    // ==================== REQUIREMENT FLOW ====================
    
    async startRequirementFlow() {
        if (!this.requirementFlow) {
            this.requirementFlow = new RequirementFlow(this.avatar);
        }
        
        const modal = document.getElementById('requirementModal');
        modal.style.display = 'flex';
        
        const stepData = await this.requirementFlow.start();
        this.renderRequirementStep(stepData);
    }
    
    renderRequirementStep(stepData) {
        const content = document.getElementById('requirementContent');
        const progress = document.getElementById('requirementProgress');
        
        if (!stepData || !stepData.step) return;
        
        progress.style.width = stepData.progress + '%';
        
        const step = stepData.step;
        
        let html = `
            <div class="requirement-question">
                <h3>${step.question}</h3>
            </div>
        `;
        
        if (step.options) {
            html += '<div class="requirement-options">';
            step.options.forEach(option => {
                html += `
                    <button class="requirement-option" onclick="app.selectRequirementOption('${option.value}', ${step.multiSelect})">
                        ${option.label}
                    </button>
                `;
            });
            html += '</div>';
            
            if (step.multiSelect) {
                html += '<button class="control-btn" onclick="app.nextRequirementStep()">Continue</button>';
            }
        } else {
            html += '<button class="control-btn" onclick="app.nextRequirementStep()">Continue</button>';
        }
        
        content.innerHTML = html;
    }
    
    async selectRequirementOption(value, multiSelect) {
        await this.requirementFlow.handleResponse({
            value: value,
            action: multiSelect ? 'add' : 'next'
        });
        
        if (!multiSelect) {
            const stepData = await this.requirementFlow.nextStep();
            if (stepData.complete) {
                await this.completeRequirementFlow(stepData.requirements);
            } else {
                this.renderRequirementStep(stepData);
            }
        }
    }
    
    async nextRequirementStep() {
        const stepData = await this.requirementFlow.nextStep();
        if (stepData.complete) {
            await this.completeRequirementFlow(stepData.requirements);
        } else {
            this.renderRequirementStep(stepData);
        }
    }
    
    async completeRequirementFlow(requirements) {
        this.currentRequirements = requirements;
        this.closeRequirementFlow();
        
        // Show generating message
        this.addMessage('ai', 'Great! I have all the information I need. Generating your application now...');
        
        if (this.isAvatarEnabled && this.avatar) {
            await this.avatar.signMessage('LETS BUILD');
        }
        
        // Generate the application
        await this.generateApplication(requirements);
    }
    
    closeRequirementFlow() {
        document.getElementById('requirementModal').style.display = 'none';
    }
    
    // ==================== APP GENERATION ====================
    
    async generateApplication(requirements) {
        this.showTypingIndicator();
        
        const result = await this.appGenerator.generateFromRequirements(requirements);
        
        this.hideTypingIndicator();
        
        if (result.success) {
            this.addMessage('ai', '✅ Application generated successfully! Click below to preview and download.');
            
            // Show preview
            this.showPreview(result.files);
        } else {
            this.addMessage('ai', '❌ Error generating application: ' + result.error);
        }
    }
    
    showPreview(files) {
        const modal = document.getElementById('previewModal');
        modal.style.display = 'flex';
        
        this.previewManager.loadFiles(files);
        this.renderFileList(files);
    }
    
    renderFileList(files) {
        const sidebar = document.getElementById('previewSidebar');
        let html = '<div class="file-list">';
        
        files.forEach(file => {
            html += `
                <div class="file-item" onclick="app.previewManager.showFile('${file.path}')">
                    <span class="file-icon">📄</span>
                    <span class="file-name">${file.path}</span>
                </div>
            `;
        });
        
        html += '</div>';
        sidebar.innerHTML = html;
    }
    
    switchPreviewTab(tab) {
        const tabs = document.querySelectorAll('.preview-tab');
        const panels = document.querySelectorAll('.preview-panel');
        
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        event.target.classList.add('active');
        
        if (tab === 'live') {
            document.getElementById('livePreview').classList.add('active');
            this.previewManager.setPreviewMode('live');
        } else if (tab === 'code') {
            document.getElementById('codeView').classList.add('active');
            this.previewManager.setPreviewMode('code');
        } else if (tab === 'files') {
            document.getElementById('filesView').classList.add('active');
        }
    }
    
    closePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }
    
    async downloadApp() {
        await this.appGenerator.downloadPackage('my-generated-app');
        this.addMessage('ai', '📦 Application package downloaded! Check your downloads folder.');
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    
    startNewChat() {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = `
            <div class="welcome-screen" id="welcomeScreen">
                <div class="welcome-logo">B</div>
                <h1 class="welcome-title">BLACKBOX AI with Sign Language</h1>
                <p class="welcome-subtitle">Build applications using sign language. Our AI avatar will guide you through the process.</p>
                
                <div class="suggestions">
                    <div class="suggestion-card" onclick="app.startRequirementFlow()">
                        <div class="suggestion-icon">🚀</div>
                        <div class="suggestion-title">Build an App</div>
                        <div class="suggestion-desc">Start requirement gathering with sign language</div>
                    </div>
                    <div class="suggestion-card" onclick="app.openSignLanguage()">
                        <div class="suggestion-icon">👋</div>
                        <div class="suggestion-title">Sign Language Input</div>
                        <div class="suggestion-desc">Use ASL to communicate with AI</div>
                    </div>
                    <div class="suggestion-card" onclick="app.toggleAvatar(true)">
                        <div class="suggestion-icon">🤖</div>
                        <div class="suggestion-title">Enable Avatar</div>
                        <div class="suggestion-desc">AI avatar signs back to you</div>
                    </div>
                    <div class="suggestion-card" onclick="app.showDemo()">
                        <div class="suggestion-icon">🎬</div>
                        <div class="suggestion-title">View Demo</div>
                        <div class="suggestion-desc">See how it works</div>
                    </div>
                </div>
            </div>
        `;
        
        this.messageCount = 0;
        this.blackboxAPI.clearHistory();
    }
    
    showDemo() {
        this.addMessage('ai', `Welcome to the Sign Language Interface Demo!

**Features:**
1. 👋 **Sign Language Recognition** - Use ASL to communicate
2. 🤖 **AI Avatar** - Avatar signs back to you
3. 📝 **Requirement Gathering** - Build apps through conversation
4. 🚀 **Code Generation** - Blackbox AI generates your app
5. 👁️ **Live Preview** - See your app instantly

**Try it now:**
- Click the camera icon to start sign language recognition
- Enable the avatar toggle to see AI sign back
- Click "Build an App" to start the requirement flow`);
    }
    
    showSettings() {
        this.addMessage('ai', `**Settings:**

- Avatar Mode: ${this.isAvatarEnabled ? 'Enabled ✅' : 'Disabled ❌'}
- Recognition: Enhanced ML Model
- API Mode: ${this.blackboxAPI.isDemoMode ? 'Demo' : 'Live'}

Toggle avatar mode using the switch in the sidebar.`);
    }
    
    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
    
    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
    
    cleanup() {
        if (this.camera) this.camera.stop();
        if (this.stream) this.stream.getTracks().forEach(track => track.stop());
        if (this.hands) this.hands.close();
        if (this.avatar) this.avatar.destroy();
    }
}

// Initialize the application
const app = new SignLanguageApp();
