
import React from 'react';
import { useLiterature } from '../hooks/useLiterature';
import AnimatedPage from '../components/AnimatedPage';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LiteratureCard: React.FC<{ work: import('../types').Literature }> = ({ work }) => {
  return (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Link to={`/literature/${work.id}`} className="block p-6 h-full">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{work.type}</p>
        <h3 className="text-xl font-bold text-gray-800 mt-2">{work.title}</h3>
        {work.excerpt && <p className="text-gray-600 mt-3 text-sm">{work.excerpt}</p>}
      </Link>
    </motion.div>
  );
};

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
  const { literature, isLoading, error } = useLiterature();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
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
            <motion.div key={work.id} variants={itemVariants}>
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