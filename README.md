# Adventure Arena

> A standalone, mobile-first arcade world engineered around discipline, strength, and triumph. Built with React, TypeScript, Tailwind CSS, HTML5 Canvas, and Web Audio API.

---

## 🚀 Features

- **Three Core Trials**:
  - **Strength Runner**: One-tap jump runner collecting the 5 core strengths (*Loyalty*, *Focus*, *Hope*, *Discipline*, *Knowledge*) while dodging daily roadblocks.
  - **Gym Rush**: Smooth timing barbell lift across 3 heavy sets (Bench Press, Squats, Deadlifts) with generous zones and zero failure.
  - **Boss Battle**: Turn-based friendly confrontation against *Impossible*.
- **Surprises & Secret Protocols**:
  - Secret Stage (*Circuit Overdrive*) revealed by tapping the hero 7 times.
  - Continue screen with free arcade lives.
  - Interactive Trophy Room with progress saved in `localStorage`.
  - 3 Easter Eggs: typing `hello`, hidden corner pixel, and kinetic shake confetti.
- **Audio & Haptics**: Pure synthesized Web Audio API sound effects (no external audio files needed) and mobile vibration support.

---

## 🛠️ Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for production
```bash
npm run build
```
The compiled, production-ready static assets will be located in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

This repository is pre-configured with **relative asset paths (`base: './'`)** and an automated **GitHub Actions workflow**, making deployment seamless:

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** > **Pages** (under "Code and automation").
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push a commit or go to the **Actions** tab and click **Run workflow** on the "Deploy to GitHub Pages" action.
5. Your site will automatically build and publish to `https://<your-username>.github.io/<repo-name>/`.

### Method 2: Manual Deployment

Run the build script:
```bash
npm run build
```
Deploy the generated `dist/` directory to your hosting provider or a `gh-pages` branch. Because relative paths are configured, the site runs from any subfolder or custom domain.

---

## 📦 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio**: Web Audio API (native browser synthesis, zero external dependencies)
- **Persistence**: `localStorage` (fully standalone, zero backend required)
