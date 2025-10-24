import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <motion.img 
            src="https://res.cloudinary.com/dubg7bfmv/image/upload/v1761320210/3-3_f3ifqn.jpg" 
            alt="Author Portrait" 
            className="rounded-lg shadow-lg w-48 md:w-64"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.div 
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-3xl italic text-gray-600 leading-relaxed">
              "I write because silence is too ordinary."
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default About;