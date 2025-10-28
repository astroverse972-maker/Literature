
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { useLiterature } from '../hooks/useLiterature';
import LiteratureCard from '../components/LiteratureCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Home: React.FC = () => {
  const { literature, isLoading, error, refetch } = useLiterature();
  const recentWorks = literature.slice(0, 3);

  return (
    <AnimatedPage>
      <div className="text-center py-12">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-12 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Poems, Essays, and Stories
        </motion.h1>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Works</h2>

          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold">Could not load recent works.</p>
              <p className="text-sm mt-1">Please check your internet connection and disable any ad-blockers that might be interfering.</p>
              <button
                onClick={() => refetch()}
                className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && recentWorks.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recentWorks.map((work) => (
                <motion.div key={work.id} variants={itemVariants} className="h-full">
                  <LiteratureCard work={work} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && !error && recentWorks.length === 0 && (
            <p className="text-gray-500">No works published yet.</p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/literature"
            className="inline-block bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Works
          </Link>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Home;
