import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import LiteraturePage from './pages/LiteraturePage';
import LiteratureDetail from './pages/LiteratureDetail';
import Admin from './pages/Admin';
import { MusicProvider } from './contexts/MusicContext';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Toaster 
          position="bottom-center"
          toastOptions={{
              duration: 3000,
              style: {
                  background: '#333',
                  color: '#fff',
              },
          }}
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/literature" element={<LiteraturePage />} />
            <Route path="/literature/:id" element={<LiteratureDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </main>
      <GlobalMusicPlayer />
    </div>
  );
}


function App() {
  return (
    <HashRouter>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </HashRouter>
  );
}

export default App;