import React from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../contexts/MusicContext';

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const GlobalMusicPlayer: React.FC = () => {
  const { isPlaying, toggleMusic } = useMusic();
  
  return (
    <motion.div
        className="fixed bottom-5 right-5 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
    >
        <button
            onClick={toggleMusic}
            className="flex items-center justify-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 h-12 px-5 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label={isPlaying ? 'Pause ambience' : 'Play ambience'}
        >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span className="text-sm font-medium pr-1">
              {isPlaying ? 'Pause Ambience' : 'Play Ambience'}
            </span>
        </button>
    </motion.div>
  );
};

export default GlobalMusicPlayer;