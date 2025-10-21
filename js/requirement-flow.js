/**
 * Requirement Gathering Flow
 * Acts as a product owner/developer gathering requirements via sign language
 */

class RequirementFlow {
    constructor(avatarController) {
        this.avatar = avatarController;
        this.currentStep = 0;
        this.requirements = {
            appType: null,
            features: [],
            targetAudience: null,
            techStack: [],
            additionalNotes: []
        };
        
        this.conversationFlow = this.initializeFlow();
        this.isActive = false;
    }
    
    initializeFlow() {
        return [
            {
                id: 'greeting',
                question: 'HELLO I AM YOUR AI DEVELOPER',
                signMessage: 'HELLO',
                options: null,
                nextStep: 'app_type'
            },
            {
                id: 'app_type',
                question: 'What type of application do you want to build?',
                signMessage: 'WHAT TYPE APP',
                options: [
                    { value: 'web', label: 'Web Application', sign: 'WEB APP' },
                    { value: 'mobile', label: 'Mobile App', sign: 'MOBILE APP' },
                    { value: 'desktop', label: 'Desktop Application', sign: 'DESKTOP APP' },
                    { value: 'api', label: 'API/Backend', sign: 'API' }
                ],
                field: 'appType',
                nextStep: 'features'
            },
            {
                id: 'features',
                question: 'What features would you like to include?',
                signMessage: 'WHAT FEATURES',
                options: [
                    { value: 'auth', label: 'User Authentication', sign: 'LOGIN' },
                    { value: 'database', label: 'Database', sign: 'DATABASE' },
                    { value: 'api', label: 'API Integration', sign: 'API' },
                    { value: 'ui', label: 'User Interface', sign: 'UI' },
                    { value: 'payment', label: 'Payment Processing', sign: 'PAYMENT' },
                    { value: 'chat', label: 'Chat/Messaging', sign: 'CHAT' },
                    { value: 'search', label: 'Search Functionality', sign: 'SEARCH' },
                    { value: 'analytics', label: 'Analytics', sign: 'ANALYTICS' }
                ],
                field: 'features',
                multiSelect: true,
                nextStep: 'audience'
            },
            {
                id: 'audience',
                question: 'Who is your target audience?',
                signMessage: 'WHO USERS',
                options: [
                    { value: 'general', label: 'General Public', sign: 'EVERYONE' },
                    { value: 'business', label: 'Businesses', sign: 'BUSINESS' },
                    { value: 'developers', label: 'Developers', sign: 'DEVELOPERS' },
                    { value: 'students', label: 'Students', sign: 'STUDENTS' },
                    { value: 'specific', label: 'Specific Group', sign: 'SPECIFIC' }
                ],
                field: 'targetAudience',
                nextStep: 'tech_stack'
            },
            {
                id: 'tech_stack',
                question: 'Do you have any technology preferences?',
                signMessage: 'TECH PREFERENCE',
                options: [
                    { value: 'react', label: 'React', sign: 'REACT' },
                    { value: 'vue', label: 'Vue.js', sign: 'VUE' },
                    { value: 'angular', label: 'Angular', sign: 'ANGULAR' },
                    { value: 'node', label: 'Node.js', sign: 'NODE' },
                    { value: 'python', label: 'Python', sign: 'PYTHON' },
                    { value: 'none', label: 'No Preference', sign: 'NO PREFERENCE' }
                ],
                field: 'techStack',
                multiSelect: true,
                nextStep: 'additional'
            },
            {
                id: 'additional',
                question: 'Any additional requirements or notes?',
                signMessage: 'ANYTHING ELSE',
                options: [
                    { value: 'yes', label: 'Yes, I have more details', sign: 'YES' },
                    { value: 'no', label: 'No, that\'s all', sign: 'NO' }
                ],
                field: 'additionalNotes',
                nextStep: 'confirmation'
            },
            {
                id: 'confirmation',
                question: 'Let me confirm your requirements. Is this correct?',
                signMessage: 'IS THIS CORRECT',
                options: [
                    { value: 'yes', label: 'Yes, proceed', sign: 'YES' },
                    { value: 'no', label: 'No, let me change', sign: 'NO' }
                ],
                nextStep: 'generate'
            },
            {
                id: 'generate',
                question: 'Great! I will now generate your application.',
                signMessage: 'LETS BUILD',
                options: null,
                nextStep: null
            }
        ];
    }
    
    async start() {
        this.isActive = true;
        this.currentStep = 0;
        this.requirements = {
            appType: null,
            features: [],
            targetAudience: null,
            techStack: [],
            additionalNotes: []
        };
        
        await this.presentStep();
    }
    
    async presentStep() {
        const step = this.conversationFlow[this.currentStep];
        
        if (!step) {
            console.error('Invalid step');
            return;
        }
        
        // Avatar signs the question
        if (this.avatar && this.avatar.isEnabled) {
            await this.avatar.signMessage(step.signMessage);
        }
        
        // Return step data for UI to display
        return {
            step: step,
            requirements: this.requirements,
            progress: (this.currentStep / this.conversationFlow.length) * 100
        };
    }
    
    async handleResponse(response) {
        const step = this.conversationFlow[this.currentStep];
        
        if (!step) return;
        
        // Store the response
        if (step.field) {
            if (step.multiSelect) {
                if (!Array.isArray(this.requirements[step.field])) {
                    this.requirements[step.field] = [];
                }
                if (response.action === 'add') {
                    this.requirements[step.field].push(response.value);
                } else if (response.action === 'remove') {
                    this.requirements[step.field] = this.requirements[step.field].filter(
                        item => item !== response.value
                    );
                }
            } else {
                this.requirements[step.field] = response.value;
            }
        }
        
        // Avatar acknowledges
        if (this.avatar && this.avatar.isEnabled) {
            await this.avatar.signMessage('GOOD');
        }
        
        // Move to next step
        if (response.action === 'next' || response.action === 'add') {
            await this.nextStep();
        }
    }
    
    async nextStep() {
        const currentStepData = this.conversationFlow[this.currentStep];
        
        if (currentStepData.nextStep) {
            // Find next step by id
            const nextStepIndex = this.conversationFlow.findIndex(
                s => s.id === currentStepData.nextStep
            );
            
            if (nextStepIndex !== -1) {
                this.currentStep = nextStepIndex;
                return await this.presentStep();
            }
        }
        
        // End of flow
        this.isActive = false;
        return {
            complete: true,
            requirements: this.requirements
        };
    }
    
    async previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            return await this.presentStep();
        }
        return null;
    }
    
    getRequirementsSummary() {
        const summary = [];
        
        if (this.requirements.appType) {
            summary.push(`**Application Type:** ${this.requirements.appType}`);
        }
        
        if (this.requirements.features && this.requirements.features.length > 0) {
            summary.push(`**Features:** ${this.requirements.features.join(', ')}`);
        }
        
        if (this.requirements.targetAudience) {
            summary.push(`**Target Audience:** ${this.requirements.targetAudience}`);
        }
        
        if (this.requirements.techStack && this.requirements.techStack.length > 0) {
            summary.push(`**Technology Stack:** ${this.requirements.techStack.join(', ')}`);
        }
        
        if (this.requirements.additionalNotes && this.requirements.additionalNotes.length > 0) {
            summary.push(`**Additional Notes:** ${this.requirements.additionalNotes.join(', ')}`);
        }
        
        return summary.join('\n\n');
    }
    
    getBlackboxPrompt() {
        // Generate a comprehensive prompt for Blackbox AI
        let prompt = `Create a ${this.requirements.appType || 'web'} application with the following specifications:\n\n`;
        
        if (this.requirements.features && this.requirements.features.length > 0) {
            prompt += `Features:\n`;
            this.requirements.features.forEach(feature => {
                prompt += `- ${feature}\n`;
            });
            prompt += '\n';
        }
        
        if (this.requirements.targetAudience) {
            prompt += `Target Audience: ${this.requirements.targetAudience}\n\n`;
        }
        
        if (this.requirements.techStack && this.requirements.techStack.length > 0) {
            prompt += `Technology Stack: ${this.requirements.techStack.join(', ')}\n\n`;
        }
        
        prompt += `Please provide:\n`;
        prompt += `1. Complete project structure\n`;
        prompt += `2. All necessary files (HTML, CSS, JavaScript, etc.)\n`;
        prompt += `3. Clear comments and documentation\n`;
        prompt += `4. Instructions for running the application\n`;
        
        return prompt;
    }
    
    reset() {
        this.currentStep = 0;
        this.requirements = {
            appType: null,
            features: [],
            targetAudience: null,
            techStack: [],
            additionalNotes: []
        };
        this.isActive = false;
    }
}

// Export for use in main application
window.RequirementFlow = RequirementFlow;
