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

📖 **See [CONTROLS.md](CONTROLS.md) for complete control documentation**

## 🚀 **Technology Stack**

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Language**: Spanish (sample script)

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

## 📚 **Documentation**

- **[CONTROLS.md](CONTROLS.md)** - Complete control documentation
- **Code Comments** - Inline documentation throughout the codebase
- **TypeScript Types** - Well-defined interfaces in `types.ts`

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Guidelines**
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain responsive design principles
- Test on multiple devices and screen sizes

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🙏 **Acknowledgments**

- Built with modern web technologies
- Inspired by professional theater teleprompter systems
- Designed for accessibility and ease of use
