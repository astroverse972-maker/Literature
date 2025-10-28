
import React from 'react';
import { useLiterature } from '../hooks/useLiterature';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import LiteratureCard from '../components/LiteratureCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};


const LiteraturePage: React.FC = () => {
  const { literature, isLoading, error, refetch } = useLiterature();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-2">Failed to load literature</h2>
          <p className="mb-4 text-gray-700">There was a problem fetching the data. Please check your internet connection and try again.</p>
          <p className="text-sm text-gray-600 mb-4">(Note: Ad-blockers or browser extensions can sometimes cause this type of issue.)</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Works</h1>
      {literature.length > 0 ? (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {literature.map((work) => (
            <motion.div key={work.id} variants={itemVariants} className="h-full">
                <LiteratureCard work={work} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500 mt-12">No literary works have been published yet.</p>
      )}
    </AnimatedPage>
  );
};

export default LiteraturePage;
