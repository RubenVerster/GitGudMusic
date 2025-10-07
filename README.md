# 🎵 GitGudMusic Browser

A modern, responsive music collection browser built with React, TypeScript, and Vite. Browse your music library with multiple view modes, search functionality, and direct YouTube Music integration.

## ✨ Features

- **Multiple View Modes**: Tree, List, and Grid views for your music collection
- **Smart Search**: Real-time search across your entire music library
- **Advanced Filtering**: Filter by file type and folder
- **Collection Statistics**: View total files, folders, and audio files at a glance
- **YouTube Music Integration**: Click any song to search it on YouTube Music
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful gradient background with glassmorphism effects

## 🚀 Live Demo

Visit the live application: [GitGudMusic Browser](https://rubenverster.github.io/GitGudMusic/)

## 🛠️ Technology Stack

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and better developer experience
- **Vite** - Lightning-fast build tool and development server
- **React Icons** - Beautiful, customizable icons
- **CSS3** - Modern styling with gradients and animations

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/rubenverster/GitGudMusic.git
cd GitGudMusic
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── views/          # View-specific components (Tree, List, Grid)
│   ├── Header.tsx      # Header with search and controls
│   ├── Sidebar.tsx     # Stats and filters sidebar
│   └── ContentArea.tsx # Main content display
├── services/           # Data services
├── styles/            # CSS stylesheets
├── types/             # TypeScript type definitions
└── main.tsx          # Application entry point
```

## 🎵 Music Data

The application reads music data from `public/music.txt`, which should contain a tree-like structure of your music collection. The format supports:

- Folders and subfolders
- Audio files (MP3, M4A, WAV, FLAC)
- Playlist files (XSPF)

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Every push to the main branch will trigger a new deployment.

### Manual Deployment

You can also deploy manually:

```bash
npm run build
# Upload the contents of the 'dist' folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
