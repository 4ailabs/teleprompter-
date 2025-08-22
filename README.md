<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Theater Teleprompter

A professional teleprompter application designed for theater performances, presentations, and public speaking events.

## ✨ **Features**

- **🎭 Smooth Scrolling**: Professional-grade teleprompter with adjustable speed control
- **🎪 Character Recognition**: Automatically detects and formats dialogue lines
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Professional UI**: Clean, distraction-free interface with amber accent colors
- **📜 Built-in Script**: Includes a sample theatrical monologue in Spanish
- **⌨️ Keyboard Controls**: Full keyboard navigation and shortcuts
- **⏸️ Smart Pause**: Intelligent pause/resume with position memory
- **🧭 Navigation**: Skip forward/backward, go to start/end
- **📊 Progress Tracking**: Visual progress bars and status indicators
- **📱 Mobile Optimized**: Touch-friendly controls and mobile-first design
- **🔧 PWA Ready**: Installable as a mobile app

## 📱 **Mobile Features**

### **Touch-Optimized Controls**
- **Large Touch Targets**: 44px minimum button sizes for mobile
- **Gesture Support**: Touch-friendly scrolling and navigation
- **Mobile Layout**: Optimized controls layout for small screens
- **Collapsible Menu**: Speed control hidden behind settings button

### **Mobile-Specific Optimizations**
- **Viewport Control**: Prevents zoom and ensures proper scaling
- **Touch Events**: Optimized for touch devices
- **Orientation Support**: Handles landscape and portrait modes
- **Performance**: Smooth animations on mobile devices

### **PWA Capabilities**
- **Installable**: Add to home screen on mobile devices
- **Offline Ready**: Works without internet connection
- **App-like Experience**: Full-screen mode and native feel
- **Shortcuts**: Quick access to common actions

## 🎮 **Controls**

### **Keyboard Shortcuts**
- `Space` - Play/Pause
- `↑↓` - Adjust speed
- `←→` - Navigate forward/backward
- `Home` - Go to start
- `End` - Go to end

### **Mouse Controls**
- **Center Button**: Play/Pause
- **Speed Slider**: Adjust scrolling speed (10-150 px/s)
- **Navigation Buttons**: Skip, reset, and end controls

### **Mobile Controls**
- **Touch Buttons**: Large, easy-to-tap controls
- **Swipe Navigation**: Scroll through content naturally
- **Settings Menu**: Access speed control and options
- **Visual Feedback**: Clear indication of current state

📖 **See [CONTROLS.md](CONTROLS.md) for complete control documentation**

## 🚀 **Technology Stack**

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with mobile-first approach
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Language**: Spanish (sample script)
- **PWA**: Service Worker ready

## 🛠️ **Getting Started**

### **Prerequisites**

- Node.js 18+ 
- npm or yarn

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/4ailabs/teleprompter-.git
   cd teleprompter-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### **Build for Production**

```bash
npm run build
```

The built files will be in the `dist/` directory.

### **Mobile Installation**

1. **Android**: Open in Chrome and tap "Add to Home Screen"
2. **iOS**: Open in Safari and tap "Add to Home Screen"
3. **Desktop**: Install as PWA from browser menu

## 🎯 **Usage**

1. **Play/Pause**: Click the center button or press `Space` to start/stop
2. **Speed Control**: Use the slider or arrow keys to adjust scrolling speed
3. **Navigation**: Use the navigation buttons or keyboard shortcuts to move around
4. **Progress**: Monitor progress with the visual progress bars
5. **Focus Line**: The amber line indicates the current reading position

## 🎨 **Customization**

- **Scripts**: Replace the default script in `App.tsx` with your own content
- **Styling**: Modify colors and fonts in `index.css` and component files
- **Speed Range**: Adjust the speed limits in `Controls.tsx`
- **Keyboard Shortcuts**: Customize shortcuts in `App.tsx`
- **Mobile Layout**: Adjust mobile breakpoints in CSS

## 📚 **Documentation**

- **[CONTROLS.md](CONTROLS.md)** - Complete control documentation
- **Code Comments** - Inline documentation throughout the codebase
- **TypeScript Types** - Well-defined interfaces in `types.ts`
- **Mobile Guide** - Mobile-specific usage instructions

## 📱 **Mobile Best Practices**

### **For Presenters**
1. **Landscape Mode**: Use landscape for wider text display
2. **Touch Controls**: Use touch buttons for quick access
3. **Speed Adjustment**: Use the collapsible speed menu
4. **Navigation**: Swipe to navigate through content

### **For Setup**
1. **Brightness**: Set device to maximum brightness
2. **Auto-lock**: Disable auto-lock during presentations
3. **Notifications**: Enable Do Not Disturb mode
4. **Orientation**: Lock to preferred orientation

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Guidelines**
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain responsive design principles
- Test on multiple devices and screen sizes
- Ensure mobile-first approach
- Test touch interactions and gestures

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🙏 **Acknowledgments**

- Built with modern web technologies
- Inspired by professional theater teleprompter systems
- Designed for accessibility and ease of use
- Mobile-optimized for modern devices
- PWA-ready for app-like experience
