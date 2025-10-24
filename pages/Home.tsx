import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="flex flex-col items-center justify-center text-center h-full py-20">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Poems, Essays, and Stories
        </motion.h1>
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/literature"
            className="inline-block bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore the Works
          </Link>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Home;