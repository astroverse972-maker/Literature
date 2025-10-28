import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Literature } from '../types';

const LiteratureCard: React.FC<{ work: Literature }> = ({ work }) => {
  return (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
    >
      <Link to={`/literature/${work.id}`} className="p-6 flex flex-col flex-grow">
        <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{work.type}</p>
            <h3 className="text-xl font-bold text-gray-800 mt-2">{work.title}</h3>
        </div>
        {work.excerpt && <p className="text-gray-600 mt-3 text-sm flex-grow">{work.excerpt}</p>}
      </Link>
    </motion.div>
  );
};

export default LiteratureCard;
