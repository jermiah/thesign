# 🤖 BLACKBOX AI - Sign Language Interface

**Team The Sign** | BLACKBOX AI Hackathon 2024

> *"I am BLACKBOX AI. Welcome to the future of coding."*

The world's first AI coding assistant with real-time sign language recognition and Neuralink-inspired neural interface visualization.

---

## 🌟 Features

### 1. **Real-Time Sign Language Recognition** 👋
- MediaPipe Hands integration with 21-point hand landmark tracking
- ASL alphabet detection (A, B, D, I, L, S, U, V, W, Y)
- Live confidence scoring (70-95% accuracy)
- Hand skeleton overlay visualization
- Letter-by-letter text building with smart debouncing
- Camera-based input (no special hardware required)

### 2. **JARVIS-Style Holographic Interface** 🎨
- Animated 3D holographic grid background
- Futuristic scanning lines and floating particles
- Pulsing holographic rings
- 3D animated Neuralink chip (rotating torus rings)
- Status indicators (Neural Link, AI Systems, Sign Language)
- Cyberpunk aesthetics with neon cyan theme

### 3. **Neuralink Neural Interface Visualization** 🧠
- Detailed 3D Neuralink chip model
- 64 electrode threads radiating from chip
- Glowing circuit patterns and pulsing center LED
- Smooth rotation and floating animation
- Interactive "Connect to Neural Interface" modal
- "NEURAL LINK ESTABLISHED" status indicator

### 4. **AI Voice Welcome** 🔊
- Text-to-speech: "I am BLACKBOX AI. Welcome to the future of coding"
- Automatic playback on page load
- AI voice selection (Google/Microsoft voices)

### 5. **Multi-Modal Input System** 💬
- Sign language recognition via camera
- Traditional text input
- Voice commands (future integration)
- Neural interface (2035 vision concept)

---

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript** - Core web technologies
- **No frameworks** - Vanilla JS for simplicity

### 3D Graphics
- **Three.js r128** - 3D rendering engine
- **WebGL** - Hardware-accelerated graphics
- **GLTFLoader** - 3D model loading

### Machine Learning
- **MediaPipe Hands** - Google's hand tracking (21 landmarks)
- **TensorFlow.js** - ML framework
- **Custom Gesture Recognition** - Finger position analysis

### Audio
- **Web Speech API** - Text-to-speech synthesis

### Animation
- **CSS3 Animations** - Holographic effects
- **RequestAnimationFrame** - 60 FPS rendering
- **Three.js Animation Loop** - 3D model animations

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Edge 90+, Firefox 88+)
- Webcam for sign language recognition
- Internet connection for CDN libraries

### Installation

```bash
# 1. Download the project
git clone <repository-url>
cd thesign

# 2. Open the demo
open jarvis-interface.html

# Or use a local server (recommended)
python -m http.server 8000
# Visit: http://localhost:8000/jarvis-interface.html
```

That's it! No build process, no npm install needed.

---

## 📖 Usage

### Sign Language Recognition
1. Click **"👋 Sign Language"** button
2. Allow camera access
3. Click **"Start Recognition"**
4. Show ASL signs to camera
5. Watch letters appear in real-time
6. Click **"Send to Chat"**

### Neuralink Visualization
1. Click **"⚡ Neuralink Mode"** button
2. Click **"Connect to Neural Interface"**
3. Watch 3D chip appear with 64 electrodes
4. Observe rotation and floating animation

---

## 🎯 Supported ASL Gestures

| Gesture | Letter | Description |
|---------|--------|-------------|
| Fist | S | No fingers extended |
| Thumb out | A | Thumb extended sideways |
| Index up | D | Index finger pointing up |
| Pinky up | I | Pinky finger extended |
| Thumb + Index | L | L-shape |
| Thumb + Pinky | Y | Y-shape |
| Index + Middle | U | Two fingers together |
| Three fingers | W | Index, middle, ring |
| Four fingers | B | All except thumb |

---

## 📁 Project Structure

```
thesign/
├── jarvis-interface.html    # Main demo file
├── PITCH.md                 # Pitch deck
├── README.md                # This file
└── js/                      # JavaScript modules
    ├── enhanced-recognition.js
    ├── avatar-controller.js
    ├── sign-animations.js
    └── ...
```

---

## 🐛 Troubleshooting

**Camera not working?**
- Check browser permissions
- Use HTTPS or localhost
- Try Chrome/Edge

**Low recognition accuracy?**
- Improve lighting
- Use plain background
- Hold signs for 1-2 seconds

**3D chip not appearing?**
- Click "Connect to Neural Interface"
- Check WebGL support
- Wait 1-2 seconds for rendering

---

## 📜 License

MIT License - Free to use and modify

---

## 🙏 Acknowledgments

- **BLACKBOX AI** - Hackathon platform
- **Google MediaPipe** - Hand tracking technology
- **Three.js** - 3D graphics library
- **ASL Community** - Sign language resources

---

**Built with ❤️ for accessibility and inclusion**

*Team The Sign - BLACKBOX AI Hackathon 2024*
