# BLACKBOX AI Hackathon - Team The Sign

## Real-Time Sign Language Recognition Chat Interface

A BLACKBOX AI-powered chat interface with real-time American Sign Language (ASL) recognition using MediaPipe Hands and TensorFlow.js.

---

## 🎯 Project Overview

This project combines AI-powered coding assistance with accessibility features, enabling users to communicate with BLACKBOX AI using sign language. The system uses computer vision and machine learning to recognize ASL gestures in real-time and convert them to text.

---

## ✨ Features

### 1. **Real-Time Sign Language Recognition**
- MediaPipe Hands integration for hand tracking
- 21-point hand landmark detection
- ASL alphabet gesture recognition
- Visual feedback with hand skeleton overlay
- Confidence scoring for detection accuracy
- Letter-by-letter text building with debouncing

### 2. **BLACKBOX AI Chat Interface**
- Clean black and white design matching BLACKBOX AI aesthetic
- Real-time messaging with AI responses
- Message history with timestamps
- Code syntax highlighting
- Copy, feedback buttons on AI responses
- Typing indicator animation

### 3. **Supported ASL Gestures**
- **A** - Thumb out (fist with thumb on side)
- **B** - Flat hand with fingers together
- **D** - Index finger pointing up
- **I** - Pinky finger up
- **L** - Thumb and index finger (L shape)
- **S** - Closed fist
- **U** - Index and middle fingers together
- **V** - Peace sign (index and middle apart)
- **W** - Three fingers up
- **Y** - Thumb and pinky extended
- And more...

---

## 📁 Project Files

### Main Application
- **`blackbox-sign-language-real.html`** - Main application with real MediaPipe integration (USE THIS ONE)

### Development Versions
- `blackbox-ui.html` - Initial UI mockup
- `blackbox-chat-ui.html` - Chat interface with simulated sign language
- `blackbox-sign-language-chat.html` - Intermediate version

### Documentation
- `README.md` - This file

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Edge, or Firefox recommended)
- Webcam/camera access
- Internet connection (for loading MediaPipe libraries)

### Installation

1. **Clone or download this folder**
   ```bash
   cd blackbox-sign-language-hackathon
   ```

2. **Open the main file**
   ```bash
   open blackbox-sign-language-real.html
   ```
   Or simply double-click `blackbox-sign-language-real.html` in your file explorer.

### Usage

1. **Start the Application**
   - Open `blackbox-sign-language-real.html` in your browser
   - The welcome screen will appear

2. **Enable Sign Language Recognition**
   - Click the camera icon (📷) in the input area
   - Allow camera permissions when prompted
   - Wait for MediaPipe to initialize (loads the hand tracking model)

3. **Start Recognition**
   - Click "Start Recognition" button
   - Position your hand in front of the camera
   - Show ASL signs - letters will be detected and displayed
   - The system shows confidence levels for each detection

4. **Send to Chat**
   - Click "Send to Chat" to transfer recognized text to the input
   - Or type manually in the text area
   - Press Enter or click send to get AI response

5. **Chat with AI**
   - Ask coding questions
   - Get explanations of programming concepts
   - Debug code issues
   - Generate code snippets

---

## 🛠️ Technical Stack

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - Application logic

### Machine Learning & Computer Vision
- **MediaPipe Hands** - Hand tracking and landmark detection
- **TensorFlow.js** - Machine learning framework (ready for custom models)
- **Custom Gesture Recognition** - Finger position analysis for ASL

### Libraries (CDN)
```html
<!-- MediaPipe -->
@mediapipe/camera_utils
@mediapipe/control_utils
@mediapipe/drawing_utils
@mediapipe/hands

<!-- TensorFlow.js -->
@tensorflow/tfjs
```

---

## 🎨 Design

### Color Scheme
- **Background:** #000000 (Pure Black)
- **Foreground:** #FFFFFF (Pure White)
- **Accents:** #0a0a0a, #1a1a1a (Dark Grays)
- **Text:** #808080 (Medium Gray for secondary text)

### Typography
- **Font Family:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Sizes:** 12px - 32px responsive scaling

---

## 🔧 How It Works

### 1. Hand Tracking
```javascript
// MediaPipe Hands detects 21 landmarks per hand
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
```

### 2. Gesture Recognition
```javascript
// Analyzes finger positions to identify ASL letters
function recognizeGesture(landmarks) {
    // Check which fingers are extended
    // Map patterns to ASL alphabet
    // Return detected letter
}
```

### 3. Text Building
```javascript
// Debouncing prevents duplicate detections
if (currentTime - lastDetectionTime > 1500) {
    detectedLetters.push(letter);
    recognizedText = detectedLetters.join('');
}
```

---

## 🚧 Future Enhancements

### Short Term
- [ ] Add backspace/delete gesture
- [ ] Implement space gesture for word separation
- [ ] Add common word shortcuts
- [ ] Improve gesture recognition accuracy

### Medium Term
- [ ] Train custom TensorFlow.js model for better ASL recognition
- [ ] Add support for full ASL vocabulary (not just alphabet)
- [ ] Implement gesture recording and playback
- [ ] Add word prediction and autocomplete

### Long Term
- [ ] Support multiple sign languages (BSL, ISL, etc.)
- [ ] Real-time translation between sign languages
- [ ] Mobile app version
- [ ] Offline mode with local models
- [ ] Integration with BLACKBOX AI API

---

## 📚 Resources & References

### Sign Language Recognition
- [MediaPipe Hands Documentation](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [SignAll SDK](https://developers.googleblog.com/en/signall-sdk-sign-language-interface-using-mediapipe-is-now-available-for-developers/)
- [Sign Language Recognition System (GitHub)](https://github.com/JaspreetSingh-exe/Sign-Language-Recognition-System)
- [Real-Time Sign Language (GitHub)](https://github.com/paulinamoskwa/Real-Time-Sign-Language)

### Datasets
- [SignAvatars Dataset](https://github.com/ZhengdiYu/SignAvatars)
- [ASL Alphabet Dataset](https://www.kaggle.com/datasets/grassknoted/asl-alphabet)

### AI & ML
- [TensorFlow.js](https://www.tensorflow.org/js)
- [MediaPipe Solutions](https://developers.google.com/mediapipe)
- [Sign Language Translation using ML](https://community.arm.com/arm-community-blogs/b/ai-blog/posts/sign-language-translation-using-machine-learning)

---

## 👥 Team

**Team The Sign**
- BLACKBOX AI Hackathon Submission
- Focus: Accessibility & AI Integration

---

## 📄 License

This project is created for the BLACKBOX AI Hackathon.

---

## 🤝 Contributing

This is a hackathon project, but suggestions and improvements are welcome!

### To Improve Recognition Accuracy:
1. Collect more training data for ASL gestures
2. Train a custom TensorFlow.js model
3. Implement temporal smoothing for gesture sequences
4. Add context-aware prediction

---

## 🐛 Known Issues

1. **Gesture Recognition Accuracy:** Current implementation uses basic finger position analysis. For production, a trained ML model is recommended.
2. **Lighting Conditions:** Performance may vary in low-light environments.
3. **Hand Orientation:** Works best with palm facing camera.
4. **Browser Compatibility:** Requires modern browser with WebRTC support.

---

## 💡 Tips for Best Results

1. **Lighting:** Ensure good lighting on your hands
2. **Background:** Use a plain background for better detection
3. **Distance:** Keep hands 1-2 feet from camera
4. **Speed:** Hold each sign for 1-2 seconds
5. **Clarity:** Make clear, distinct gestures

---

## 📞 Support

For questions or issues:
- Check the browser console for error messages
- Ensure camera permissions are granted
- Try refreshing the page if MediaPipe fails to load
- Use Chrome or Edge for best compatibility

---

## 🎉 Acknowledgments

- **BLACKBOX AI** - For the hackathon opportunity
- **Google MediaPipe** - For the hand tracking technology
- **TensorFlow.js** - For the ML framework
- **ASL Community** - For sign language resources

---

**Built with ❤️ for accessibility and inclusion**

*Team The Sign - BLACKBOX AI Hackathon 2024*
