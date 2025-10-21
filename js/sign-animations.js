/**
 * Sign Language Animation Library
 * Contains ASL alphabet and common word/phrase animations
 */

class SignAnimations {
    constructor() {
        this.letterAnimations = this.initializeLetterAnimations();
        this.wordAnimations = this.initializeWordAnimations();
        this.phraseAnimations = this.initializePhraseAnimations();
    }
    
    initializeLetterAnimations() {
        // ASL Alphabet hand positions
        // Positions are relative to avatar body (x, y, z)
        return {
            'A': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Fist with thumb on side'
            },
            'B': {
                rightHand: { x: 0.25, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Flat hand, fingers together'
            },
            'C': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Curved hand'
            },
            'D': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Index finger up'
            },
            'E': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Fingers curled'
            },
            'F': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'OK sign'
            },
            'G': {
                rightHand: { x: 0.3, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Index and thumb horizontal'
            },
            'H': {
                rightHand: { x: 0.3, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Index and middle horizontal'
            },
            'I': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Pinky up'
            },
            'J': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Pinky up with motion',
                motion: 'curve'
            },
            'K': {
                rightHand: { x: 0.25, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Index and middle up, thumb out'
            },
            'L': {
                rightHand: { x: 0.25, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'L shape'
            },
            'M': {
                rightHand: { x: 0.2, y: 1.3, z: 0.2 },
                leftHand: null,
                description: 'Three fingers over thumb'
            },
            'N': {
                rightHand: { x: 0.2, y: 1.3, z: 0.2 },
                leftHand: null,
                description: 'Two fingers over thumb'
            },
            'O': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Fingers and thumb form circle'
            },
            'P': {
                rightHand: { x: 0.25, y: 1.3, z: 0.2 },
                leftHand: null,
                description: 'K pointing down'
            },
            'Q': {
                rightHand: { x: 0.25, y: 1.3, z: 0.2 },
                leftHand: null,
                description: 'G pointing down'
            },
            'R': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Crossed fingers'
            },
            'S': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Fist'
            },
            'T': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Thumb between fingers'
            },
            'U': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Two fingers up together'
            },
            'V': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Two fingers up apart'
            },
            'W': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Three fingers up'
            },
            'X': {
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                description: 'Bent index finger'
            },
            'Y': {
                rightHand: { x: 0.25, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Thumb and pinky out'
            },
            'Z': {
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                description: 'Z motion with index',
                motion: 'zigzag'
            }
        };
    }
    
    initializeWordAnimations() {
        // Common words in sign language
        return {
            'HELLO': {
                type: 'gesture',
                rightHand: { x: 0.15, y: 1.6, z: 0.3 },
                leftHand: null,
                motion: 'wave',
                duration: 1000,
                description: 'Hand at forehead, move forward'
            },
            'THANKS': {
                type: 'gesture',
                rightHand: { x: 0.1, y: 1.5, z: 0.3 },
                leftHand: null,
                motion: 'forward',
                duration: 800,
                description: 'Hand at chin, move forward'
            },
            'THANK YOU': {
                type: 'gesture',
                rightHand: { x: 0.1, y: 1.5, z: 0.3 },
                leftHand: null,
                motion: 'forward',
                duration: 800,
                description: 'Hand at chin, move forward'
            },
            'YES': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                motion: 'nod',
                duration: 600,
                description: 'Fist nods up and down'
            },
            'NO': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: null,
                motion: 'snap',
                duration: 500,
                description: 'Index and middle snap to thumb'
            },
            'PLEASE': {
                type: 'gesture',
                rightHand: { x: 0.1, y: 1.4, z: 0.2 },
                leftHand: null,
                motion: 'circle',
                duration: 1000,
                description: 'Hand on chest, circular motion'
            },
            'HELP': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: { x: -0.2, y: 1.3, z: 0.2 },
                motion: 'lift',
                duration: 800,
                description: 'Right hand on left palm, lift up'
            },
            'APP': {
                type: 'fingerspell',
                letters: ['A', 'P', 'P'],
                description: 'Fingerspell A-P-P'
            },
            'WEB': {
                type: 'fingerspell',
                letters: ['W', 'E', 'B'],
                description: 'Fingerspell W-E-B'
            },
            'MOBILE': {
                type: 'gesture',
                rightHand: { x: 0.15, y: 1.5, z: 0.2 },
                leftHand: null,
                motion: 'phone',
                duration: 800,
                description: 'Hand to ear like phone'
            },
            'BUILD': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: { x: -0.2, y: 1.3, z: 0.2 },
                motion: 'stack',
                duration: 1000,
                description: 'Hands stack alternating'
            },
            'CREATE': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.4, z: 0.2 },
                leftHand: { x: -0.2, y: 1.3, z: 0.2 },
                motion: 'stack',
                duration: 1000,
                description: 'Similar to BUILD'
            },
            'WANT': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.3, z: 0.3 },
                leftHand: { x: -0.2, y: 1.3, z: 0.3 },
                motion: 'pull',
                duration: 800,
                description: 'Open hands pull toward body'
            },
            'NEED': {
                type: 'gesture',
                rightHand: { x: 0.15, y: 1.4, z: 0.2 },
                leftHand: null,
                motion: 'down',
                duration: 600,
                description: 'Bent finger moves down firmly'
            },
            'UNDERSTAND': {
                type: 'gesture',
                rightHand: { x: 0.15, y: 1.6, z: 0.2 },
                leftHand: null,
                motion: 'flick',
                duration: 500,
                description: 'Finger at forehead, flick up'
            },
            'QUESTION': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.6, z: 0.3 },
                leftHand: null,
                motion: 'question_mark',
                duration: 800,
                description: 'Draw question mark in air'
            },
            'WHAT': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.4, z: 0.3 },
                leftHand: { x: -0.2, y: 1.4, z: 0.3 },
                motion: 'shake',
                duration: 600,
                description: 'Hands shake side to side'
            },
            'HOW': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.3, z: 0.2 },
                leftHand: { x: -0.2, y: 1.3, z: 0.2 },
                motion: 'roll',
                duration: 800,
                description: 'Knuckles together, roll forward'
            },
            'WHY': {
                type: 'gesture',
                rightHand: { x: 0.15, y: 1.6, z: 0.2 },
                leftHand: null,
                motion: 'wiggle',
                duration: 600,
                description: 'Fingers at forehead, wiggle'
            },
            'GOOD': {
                type: 'gesture',
                rightHand: { x: 0.1, y: 1.5, z: 0.3 },
                leftHand: null,
                motion: 'forward_down',
                duration: 700,
                description: 'Hand at chin, move forward and down'
            },
            'OK': {
                type: 'gesture',
                rightHand: { x: 0.2, y: 1.5, z: 0.2 },
                leftHand: null,
                motion: 'none',
                duration: 600,
                description: 'OK sign (F handshape)'
            },
            'READY': {
                type: 'gesture',
                rightHand: { x: 0.25, y: 1.4, z: 0.2 },
                leftHand: { x: -0.25, y: 1.4, z: 0.2 },
                motion: 'side_to_side',
                duration: 800,
                description: 'R hands move side to side'
            }
        };
    }
    
    initializePhraseAnimations() {
        // Common phrases
        return {
            'WHAT DO YOU WANT': {
                sequence: ['WHAT', 'WANT'],
                description: 'What do you want?'
            },
            'TELL ME MORE': {
                sequence: ['TELL', 'MORE'],
                description: 'Tell me more'
            },
            'I UNDERSTAND': {
                sequence: ['UNDERSTAND'],
                description: 'I understand'
            },
            'LETS BUILD': {
                sequence: ['BUILD'],
                description: 'Let\'s build'
            },
            'WHAT FEATURES': {
                sequence: ['WHAT', 'FEATURES'],
                description: 'What features?'
            },
            'WHAT TYPE': {
                sequence: ['WHAT', 'TYPE'],
                description: 'What type?'
            },
            'IS THIS CORRECT': {
                sequence: ['CORRECT', 'QUESTION'],
                description: 'Is this correct?'
            },
            'ANYTHING ELSE': {
                sequence: ['MORE', 'QUESTION'],
                description: 'Anything else?'
            }
        };
    }
    
    hasLetterAnimation(letter) {
        return this.letterAnimations.hasOwnProperty(letter.toUpperCase());
    }
    
    hasWordAnimation(word) {
        return this.wordAnimations.hasOwnProperty(word.toUpperCase());
    }
    
    hasPhraseAnimation(phrase) {
        return this.phraseAnimations.hasOwnProperty(phrase.toUpperCase());
    }
    
    getLetterAnimation(letter) {
        return this.letterAnimations[letter.toUpperCase()] || null;
    }
    
    getWordAnimation(word) {
        return this.wordAnimations[word.toUpperCase()] || null;
    }
    
    getPhraseAnimation(phrase) {
        return this.phraseAnimations[phrase.toUpperCase()] || null;
    }
    
    /**
     * Get animation sequence for a message
     */
    getAnimationSequence(message) {
        const sequence = [];
        const words = message.toUpperCase().split(' ');
        
        // Try to match phrases first
        for (let i = 0; i < words.length; i++) {
            let matched = false;
            
            // Try 4-word phrases
            if (i + 3 < words.length) {
                const phrase = words.slice(i, i + 4).join(' ');
                if (this.hasPhraseAnimation(phrase)) {
                    sequence.push({ type: 'phrase', value: phrase });
                    i += 3;
                    matched = true;
                    continue;
                }
            }
            
            // Try 3-word phrases
            if (i + 2 < words.length) {
                const phrase = words.slice(i, i + 3).join(' ');
                if (this.hasPhraseAnimation(phrase)) {
                    sequence.push({ type: 'phrase', value: phrase });
                    i += 2;
                    matched = true;
                    continue;
                }
            }
            
            // Try 2-word phrases
            if (i + 1 < words.length) {
                const phrase = words.slice(i, i + 2).join(' ');
                if (this.hasPhraseAnimation(phrase)) {
                    sequence.push({ type: 'phrase', value: phrase });
                    i += 1;
                    matched = true;
                    continue;
                }
            }
            
            // Try single word
            if (!matched) {
                const word = words[i];
                if (this.hasWordAnimation(word)) {
                    sequence.push({ type: 'word', value: word });
                } else {
                    // Fingerspell
                    sequence.push({ type: 'fingerspell', value: word });
                }
            }
        }
        
        return sequence;
    }
}

// Export for use in main application
window.SignAnimations = SignAnimations;
