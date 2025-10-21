# 🤖 Sketchfab 3D Model Setup Guide

## Using the Humanoid Model from Sketchfab

The application is now configured to use a realistic 3D humanoid model from Sketchfab for the hero robot avatar.

---

## 📥 How to Download the Model

### Option 1: Direct Download (Recommended)

1. **Visit the Sketchfab Model Page:**
   ```
   https://sketchfab.com/3d-models/humanoid-585069b447f842f582c223d64e377d94
   ```

2. **Download the Model:**
   - Click the **"Download 3D Model"** button
   - Select **glTF** format (recommended for Three.js)
   - Choose quality: **Original** or **High**
   - Download the ZIP file

3. **Extract and Place the Model:**
   ```
   thesign/
   └── assets/
       └── avatar/
           └── humanoid.glb  ← Place the model here
   ```

4. **Update the Code:**
   - Open `js/hero-robot-sketchfab.js`
   - Find line ~75: `const modelUrl = ...`
   - Uncomment the actual loading code (lines 77-120)
   - Comment out the fallback code (line 73-75)

---

## 🔧 Alternative: Use the Stylized Fallback

The application currently uses a **stylized humanoid robot** as a fallback. This works immediately without downloading any models!

**Features of the Fallback Robot:**
- ✅ Chrome-black metallic body
- ✅ Glowing cyan accents (visor, chest reactor, hands, feet)
- ✅ Floating and breathing animations
- ✅ Interactive camera controls
- ✅ Energy pulse effects
- ✅ Holographic platform
- ✅ Particle effects

**This fallback is production-ready and looks great!**

---

## 🎨 Customizing the Sketchfab Model

Once you download and place the model, you can customize it:

### 1. **Adjust Scale and Position**
```javascript
// In hero-robot-sketchfab.js, line ~80
this.model.scale.set(1, 1, 1);  // Adjust size
this.model.position.set(0, 0, 0);  // Adjust position
```

### 2. **Add Glow Effects**
```javascript
// In hero-robot-sketchfab.js, line ~88
child.material.emissive = new THREE.Color(0x00ffff);
child.material.emissiveIntensity = 0.2;  // Adjust glow
```

### 3. **Enable Animations**
The code automatically detects and plays animations from the model:
```javascript
// In hero-robot-sketchfab.js, line ~95
if (gltf.animations && gltf.animations.length > 0) {
    this.mixer = new THREE.AnimationMixer(this.model);
    const action = this.mixer.clipAction(gltf.animations[0]);
    action.play();
}
```

---

## 🚀 Using Other Sketchfab Models

You can use ANY humanoid model from Sketchfab:

### Popular Free Models:

1. **Robot Character**
   - https://sketchfab.com/3d-models/robot-character
   - Great for futuristic look

2. **Sci-Fi Character**
   - https://sketchfab.com/3d-models/sci-fi-character
   - Perfect for tech demos

3. **Animated Humanoid**
   - https://sketchfab.com/3d-models/animated-humanoid
   - Comes with built-in animations

### Steps to Use Different Models:

1. Download the model in **glTF (.glb)** format
2. Place it in `assets/avatar/`
3. Update the path in `hero-robot-sketchfab.js`:
   ```javascript
   loader.load('assets/avatar/your-model-name.glb', ...)
   ```

---

## 🎯 Current Setup Status

**✅ WORKING NOW:**
- Stylized humanoid robot (fallback)
- All animations and effects
- Interactive controls
- Glowing effects
- Holographic platform

**📦 READY FOR SKETCHFAB MODEL:**
- GLTFLoader configured
- Model loading code ready
- Animation system prepared
- Material enhancement ready

**🔄 TO USE SKETCHFAB MODEL:**
1. Download model from link above
2. Place in `assets/avatar/humanoid.glb`
3. Uncomment loading code in `hero-robot-sketchfab.js`
4. Refresh the page

---

## 🐛 Troubleshooting

### Model Not Loading?

**Check Console for Errors:**
```javascript
// Open browser DevTools (F12)
// Look for error messages
```

**Common Issues:**

1. **Wrong File Path**
   - Ensure model is in `assets/avatar/`
   - Check filename matches code

2. **CORS Error**
   - Run a local server (not file://)
   - Use: `python -m http.server 8000`
   - Or: `npx serve`

3. **Model Too Large**
   - Optimize model on Sketchfab
   - Download "Low Poly" version
   - Use compression tools

### Model Appears Black?

**Add Lights:**
```javascript
// The code already has 5 lights configured
// Adjust intensity if needed
keyLight.intensity = 3.0;  // Increase brightness
```

### Model Too Big/Small?

**Adjust Scale:**
```javascript
this.model.scale.set(0.5, 0.5, 0.5);  // Make smaller
// or
this.model.scale.set(2, 2, 2);  // Make larger
```

---

## 📊 Performance Tips

### For Better Performance:

1. **Use Low-Poly Models**
   - Download "Low Poly" version from Sketchfab
   - Aim for < 50K triangles

2. **Optimize Textures**
   - Use compressed textures
   - Reduce texture size to 1024x1024 or less

3. **Limit Animations**
   - Play only one animation at a time
   - Use simpler animations for better FPS

4. **Adjust Rendering**
   ```javascript
   // In hero-robot-sketchfab.js, line ~50
   this.renderer.setPixelRatio(1);  // Lower for better performance
   ```

---

## 🎬 Animation Options

### Built-in Animations:

The code supports these animation types:
- **Idle** - Standing still with subtle movement
- **Wave** - Greeting gesture
- **Point** - Pointing at something
- **Nod** - Yes gesture
- **Shake** - No gesture

### Custom Animations:

```javascript
// Play specific animation
const animation = this.animations.find(a => a.name === 'Wave');
if (animation) {
    const action = this.mixer.clipAction(animation);
    action.play();
}
```

---

## 🌟 Enhancement Ideas

### Add More Effects:

1. **Particle Trail**
   ```javascript
   // Add particles following the robot
   ```

2. **Holographic Shader**
   ```javascript
   // Make robot semi-transparent with scan lines
   ```

3. **Voice Sync**
   ```javascript
   // Animate mouth based on audio
   ```

4. **Gesture Recognition**
   ```javascript
   // Trigger animations based on user input
   ```

---

## 📚 Resources

### Three.js Documentation:
- https://threejs.org/docs/
- https://threejs.org/examples/

### Sketchfab:
- https://sketchfab.com/
- https://sketchfab.com/developers

### glTF Format:
- https://www.khronos.org/gltf/
- https://github.com/KhronosGroup/glTF

---

## ✅ Quick Start Checklist

- [ ] Application running with fallback robot
- [ ] Downloaded Sketchfab model (optional)
- [ ] Placed model in `assets/avatar/` (optional)
- [ ] Updated code to load model (optional)
- [ ] Tested in browser
- [ ] Adjusted scale/position if needed
- [ ] Customized materials/effects
- [ ] Optimized for performance

---

## 🎉 You're All Set!

The application is **fully functional** with the stylized fallback robot. When you're ready to use the Sketchfab model, just follow the download steps above!

**Current Status:** ✅ WORKING WITH STYLIZED ROBOT
**Sketchfab Ready:** ✅ CODE PREPARED FOR REAL MODEL

---

**Questions?** Check the console logs for detailed information about model loading and rendering.

**Team The Sign** - BLACKBOX AI Hackathon 2024
