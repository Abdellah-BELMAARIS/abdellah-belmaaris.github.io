# Abdellah BELMAARIS — Portfolio Website

> A premium, interactive personal portfolio website built with **React**, **TypeScript**, **Vite**, and **Three.js**.

🔗 **Live site:** [abdellah-belmaaris.github.io](https://abdellah-belmaaris.github.io/)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 **Loading Splash Screen** | Animated progress bar intro with logo reveal |
| 🌌 **3D WebGL Background** | Interactive Three.js particle system with mouse parallax & scroll reactivity |
| ⌨️ **Typewriter Animation** | Sequential hero text reveal with blinking cursor |
| 📊 **Animated Stats** | Intersection-observer-driven count-up stats in the About section |
| 🗂️ **Featured Project Carousel** | Auto-advancing screenshot carousel with video demo modal |
| 🗂️ **Other Projects Grid** | Spotlight-effect card grid showcasing additional projects |
| 🎓 **Education & Certifications** | Cards with certificate image lightbox viewer |
| 📬 **Contact Form** | FormSubmit.co-powered contact form with status feedback |
| 📱 **Fully Responsive** | Mobile-first design with animated hamburger navigation |
| ⬆️ **Scroll-to-Top** | Smooth animated scroll-to-top button |
| 🔍 **SEO & Social** | Open Graph, Twitter Card, canonical URL, meta keywords |

---

## 🛠 Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (build tool)
- **Framer Motion** (animations)
- **Three.js** + **@react-three/fiber** (3D background)
- **Font Awesome 6** (icons)
- **Google Fonts** — Inter, Poppins, Fira Code
- **FormSubmit.co** (contact form backend)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📁 Project Structure

```
myweb/
├── public/
│   └── assets/          # Images, videos, certificates, avatar
├── src/
│   ├── components/
│   │   └── ThreeBackground.tsx   # 3D WebGL canvas component
│   ├── App.tsx           # Main portfolio app
│   ├── index.css         # All styles (design system)
│   └── main.tsx          # React entry point
├── index.html            # HTML entry + SEO meta tags
└── vite.config.ts
```

---

## 📦 Deployment

The site is deployed to **GitHub Pages** via the `gh-pages` branch. The production build outputs to `dist/`.

```bash
npm run build
# Then push dist/ contents to the gh-pages branch
```

---

## 📄 License

© 2026 Abdellah BELMAARIS. All rights reserved.
