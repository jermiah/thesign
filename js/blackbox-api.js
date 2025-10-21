/**
 * Blackbox AI API Integration
 * Handles communication with Blackbox AI for code generation
 */

class BlackboxAPI {
    constructor() {
        this.apiEndpoint = 'https://api.blackbox.ai/v1/chat/completions';
        this.apiKey = null; // Will be set by user or use demo mode
        this.conversationHistory = [];
        this.isDemoMode = true; // Set to false when API key is available
    }
    
    setApiKey(key) {
        this.apiKey = key;
        this.isDemoMode = !key;
    }
    
    /**
     * Send a message to Blackbox AI
     */
    async sendMessage(message, context = null) {
        if (this.isDemoMode) {
            return await this.demoResponse(message, context);
        }
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    messages: [
                        ...this.conversationHistory,
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    model: 'blackbox-ai',
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );
            
            return {
                success: true,
                response: aiResponse,
                usage: data.usage
            };
            
        } catch (error) {
            console.error('Blackbox AI API error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Generate application code based on requirements
     */
    async generateApplication(requirements) {
        const prompt = this.buildGenerationPrompt(requirements);
        
        if (this.isDemoMode) {
            return await this.demoGenerateApplication(requirements);
        }
        
        return await this.sendMessage(prompt);
    }
    
    buildGenerationPrompt(requirements) {
        let prompt = `You are an expert full-stack developer. Create a complete ${requirements.appType || 'web'} application based on these requirements:\n\n`;
        
        prompt += `**Application Type:** ${requirements.appType}\n\n`;
        
        if (requirements.features && requirements.features.length > 0) {
            prompt += `**Required Features:**\n`;
            requirements.features.forEach(feature => {
                prompt += `- ${this.getFeatureDescription(feature)}\n`;
            });
            prompt += '\n';
        }
        
        if (requirements.targetAudience) {
            prompt += `**Target Audience:** ${requirements.targetAudience}\n\n`;
        }
        
        if (requirements.techStack && requirements.techStack.length > 0) {
            prompt += `**Technology Stack:** ${requirements.techStack.join(', ')}\n\n`;
        }
        
        prompt += `Please provide:\n`;
        prompt += `1. Complete, production-ready code\n`;
        prompt += `2. All necessary files with proper structure\n`;
        prompt += `3. Clear comments and documentation\n`;
        prompt += `4. Setup and running instructions\n`;
        prompt += `5. Best practices and security considerations\n\n`;
        
        prompt += `Format the response as a structured project with file paths and complete code for each file.`;
        
        return prompt;
    }
    
    getFeatureDescription(feature) {
        const descriptions = {
            'auth': 'User authentication and authorization system',
            'database': 'Database integration with CRUD operations',
            'api': 'RESTful API endpoints',
            'ui': 'Modern, responsive user interface',
            'payment': 'Payment processing integration',
            'chat': 'Real-time chat/messaging functionality',
            'search': 'Search functionality with filters',
            'analytics': 'Analytics and reporting dashboard'
        };
        
        return descriptions[feature] || feature;
    }
    
    /**
     * Demo mode responses (when no API key is available)
     */
    async demoResponse(message, context) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return {
                success: true,
                response: 'Hello! I\'m your AI developer assistant. I can help you build applications using sign language. What would you like to create today?',
                demo: true
            };
        }
        
        if (lowerMessage.includes('web') || lowerMessage.includes('app')) {
            return {
                success: true,
                response: 'Great! I can help you build a web application. Let me gather some requirements through sign language. What features would you like to include?',
                demo: true
            };
        }
        
        if (lowerMessage.includes('feature') || lowerMessage.includes('function')) {
            return {
                success: true,
                response: 'I understand you want to add features. Common features include:\n- User authentication\n- Database integration\n- API endpoints\n- Modern UI\n- Payment processing\n\nWhich ones would you like?',
                demo: true
            };
        }
        
        return {
            success: true,
            response: 'I\'m processing your request. In demo mode, I can show you how the system works. For full functionality, please provide a Blackbox AI API key.',
            demo: true
        };
    }
    
    async demoGenerateApplication(requirements) {
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const appType = requirements.appType || 'web';
        const features = requirements.features || [];
        
        // Generate demo code based on requirements
        const files = this.generateDemoCode(appType, features, requirements);
        
        return {
            success: true,
            response: 'Application generated successfully!',
            files: files,
            demo: true
        };
    }
    
    generateDemoCode(appType, features, requirements) {
        const files = [];
        
        // Generate index.html
        files.push({
            path: 'index.html',
            content: this.generateHTML(appType, features, requirements)
        });
        
        // Generate styles.css
        files.push({
            path: 'styles.css',
            content: this.generateCSS(appType, features)
        });
        
        // Generate app.js
        files.push({
            path: 'app.js',
            content: this.generateJavaScript(appType, features, requirements)
        });
        
        // Generate README
        files.push({
            path: 'README.md',
            content: this.generateREADME(appType, features, requirements)
        });
        
        return files;
    }
    
    generateHTML(appType, features, requirements) {
        const hasAuth = features.includes('auth');
        const hasUI = features.includes('ui');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${requirements.appType || 'My'} Application</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${requirements.appType || 'My'} Application</h1>
            <p>Built with Blackbox AI & Sign Language</p>
        </header>
        
        <main>
            ${hasAuth ? `
            <section class="auth-section">
                <h2>User Authentication</h2>
                <form id="loginForm">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
            </section>
            ` : ''}
            
            ${hasUI ? `
            <section class="main-content">
                <h2>Welcome to Your Application</h2>
                <p>This application was generated based on your sign language requirements.</p>
                
                <div class="features">
                    ${features.map(f => `<div class="feature-card">${f}</div>`).join('\n                    ')}
                </div>
            </section>
            ` : ''}
            
            <section class="info">
                <h3>Features Included:</h3>
                <ul>
                    ${features.map(f => `<li>${this.getFeatureDescription(f)}</li>`).join('\n                    ')}
                </ul>
            </section>
        </main>
        
        <footer>
            <p>Generated by Blackbox AI with Sign Language Interface</p>
        </footer>
    </div>
    
    <script src="app.js"></script>
</body>
</html>`;
    }
    
    generateCSS(appType, features) {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    text-align: center;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

main {
    padding: 40px;
}

section {
    margin-bottom: 40px;
}

h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.8rem;
}

.auth-section form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 400px;
}

.auth-section input {
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}

.auth-section button {
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
}

.auth-section button:hover {
    transform: translateY(-2px);
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.feature-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    font-weight: 600;
    text-transform: capitalize;
}

.info ul {
    list-style: none;
    padding-left: 0;
}

.info li {
    padding: 10px;
    margin-bottom: 10px;
    background: #f5f5f5;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 20px;
}

@media (max-width: 768px) {
    header h1 {
        font-size: 1.8rem;
    }
    
    main {
        padding: 20px;
    }
}`;
    }
    
    generateJavaScript(appType, features, requirements) {
        const hasAuth = features.includes('auth');
        
        return `// ${requirements.appType || 'Application'} JavaScript
// Generated by Blackbox AI with Sign Language Interface

console.log('Application initialized!');

${hasAuth ? `
// Authentication functionality
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    // Demo authentication
    console.log('Login attempt:', email);
    alert('Login successful! (Demo mode)');
});
` : ''}

// Application features
const features = ${JSON.stringify(features, null, 2)};

console.log('Enabled features:', features);

// Add your custom functionality here
class Application {
    constructor() {
        this.features = features;
        this.init();
    }
    
    init() {
        console.log('Initializing application with features:', this.features);
        
        // Initialize each feature
        this.features.forEach(feature => {
            this.initializeFeature(feature);
        });
    }
    
    initializeFeature(feature) {
        console.log('Initializing feature:', feature);
        
        // Add feature-specific initialization here
        switch(feature) {
            case 'auth':
                this.setupAuth();
                break;
            case 'database':
                this.setupDatabase();
                break;
            case 'api':
                this.setupAPI();
                break;
            // Add more cases as needed
        }
    }
    
    setupAuth() {
        console.log('Authentication system ready');
    }
    
    setupDatabase() {
        console.log('Database connection ready');
    }
    
    setupAPI() {
        console.log('API endpoints ready');
    }
}

// Initialize application
const app = new Application();`;
    }
    
    generateREADME(appType, features, requirements) {
        return `# ${requirements.appType || 'My'} Application

Generated by **Blackbox AI** with **Sign Language Interface**

## Overview

This application was created based on requirements gathered through sign language recognition.

## Features

${features.map(f => `- ${this.getFeatureDescription(f)}`).join('\n')}

## Technology Stack

${requirements.techStack && requirements.techStack.length > 0 
    ? requirements.techStack.map(t => `- ${t}`).join('\n')
    : '- HTML5\n- CSS3\n- JavaScript'}

## Getting Started

1. Open \`index.html\` in a modern web browser
2. The application will load automatically
3. Explore the features listed above

## Target Audience

${requirements.targetAudience || 'General users'}

## Development

This is a demo application generated by Blackbox AI. For production use:

1. Add proper backend integration
2. Implement security measures
3. Add error handling
4. Set up proper database connections
5. Configure API endpoints

## Credits

- Built with Blackbox AI
- Sign Language Interface by Team The Sign
- BLACKBOX AI Hackathon 2024

## License

MIT License - Feel free to modify and use as needed.
`;
    }
    
    clearHistory() {
        this.conversationHistory = [];
    }
}

// Export for use in main application
window.BlackboxAPI = BlackboxAPI;
