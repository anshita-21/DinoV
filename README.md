# Dino Video Player Application

A mobile-first video player application built with React, TypeScript, and Vite. Features a YouTube-like interface with smooth video playback, custom controls, and gesture-based interactions.

## Features

- **Home Page - Video Feed**: Scrollable list of videos grouped by category
- **Full-Page Video Player**: Auto-playing video player with custom controls
- **Custom Video Controls**: Play/pause, skip forward/backward (+10/-10 seconds), seekable progress bar, and time display
- **In-Player Video List**: Swipe up or scroll down to reveal related videos from the same category
- **Responsive Design**: Mobile-first design that works seamlessly on both mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Project Structure

```
src/
├── components/          # React components
│   ├── VideoCard.tsx    # Video card for home feed
│   ├── VideoPlayer.tsx  # Full-page video player
│   ├── VideoControls.tsx # Custom video controls
│   ├── VideoList.tsx    # In-player video list
│   └── CategorySection.tsx # Category grouping
├── types/               # TypeScript interfaces
├── data/                # Video dataset
├── hooks/               # Custom React hooks
├── styles/              # Global styles
└── App.tsx              # Main app component
```

## Technologies Used

- React 18
- TypeScript
- Vite
- YouTube IFrame API
- Plain CSS (mobile-first, responsive)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is created for the Dino Ventures Frontend Engineer Assignment.

