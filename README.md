# VoxelGod 🎲✨

A mobile-first 3D voxel sandbox and puzzle challenge game with pastel aesthetics, free building, symmetry tools, and collection tracking. Built purely client-side with React, Three.js, and React Three Fiber.

[![Deploy to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](https://github.com)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 🌟 Highlights & Features

- **100% Client-Side**: No backend or external API keys needed. Runs completely in the browser and can be hosted statically (GitHub Pages, Cloudflare Pages, Vercel, etc.).
- **Creative Sandbox Mode**: Freely build and sculpt voxel creations. Your world is automatically persisted locally in your browser (`localStorage`).
- **Challenge Mode**: Complete 3D voxel puzzle challenges with 3D ghost mesh guides, step-by-step guidance, and victory celebrations.
- **Challenge Collection**: Track your completed builds and unlocked designs.
- **Symmetry Tool**: Mirror your placements in real-time along X, Z, or dual axes for symmetrical architecture.
- **Pastel Color Studio**: Rich pastel palettes and custom color selector.
- **Environment & Weather**: Dynamic skies, day/night atmospheres, and weather particle systems (snow, rain, sparkles).
- **Turntable GIF & Snapshot Export**: Capture animated 360° rotating GIFs or snapshots of your voxel models.
- **Audio Feedback**: Procedural audio effects generated via the Web Audio API.
- **Mobile & Desktop Friendly**: Touch-optimized HUD with dedicated zoom controls, plus desktop keyboard shortcuts.

---

## 🎮 Controls & Shortcuts

### Desktop Controls
| Key | Action |
| --- | --- |
| `1` - `8` | Select hotbar voxel block |
| `B` | Switch to **Build** mode |
| `D` or `X` | Switch to **Destroy** mode |
| `M` | Cycle **Symmetry** mode (Off → X → Z → Dual) |
| `Ctrl + Z` / `Cmd + Z` | Undo last action |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo action |
| Left Click + Drag | Rotate camera orbit |
| Right Click + Drag / Two-Finger Drag | Pan camera |
| Mouse Wheel | Zoom in / out |

### Mobile / Touch Controls
- **1-Finger Drag**: Rotate camera orbit around the scene
- **Tap**: Place or remove block (depending on active tool)
- **Side Slider**: Dedicated 1-finger zoom slider for easy one-handed navigation
- **Touch HUD**: Quick access to symmetry, palette, snapshots, challenges, and world presets

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/voxel-god.git
   cd voxel-god
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the URL displayed in the terminal).

### Available Scripts

- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Bundles the application for production into the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Checks TypeScript types with `tsc --noEmit`.
- `npm run clean`: Cleans the `dist/` output directory.

---

## 🌐 Deploy to GitHub Pages

This project is already pre-configured for automated deployment to **GitHub Pages** using GitHub Actions.

### Step-by-Step Setup:

1. Push your repository to GitHub on the `main` branch.
2. In your repository on GitHub, navigate to:
   **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - Change **Source** from *Deploy from a branch* to **GitHub Actions**.
4. That's it! Every time you push changes to `main`, the workflow in `.github/workflows/deploy.yml` will automatically build the client application and publish it to GitHub Pages.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animation & Export**: [Motion](https://motion.dev/) + [gifenc](https://github.com/mattdesl/gifenc)
- **Bundler**: [Vite 6](https://vitejs.dev/)

---

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).
