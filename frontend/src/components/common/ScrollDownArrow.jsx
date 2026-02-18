import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';

const ScrollDownArrow = ({ nextSectionId }) => {
  if (!nextSectionId) return null;

  const handleScroll = () => {
    document
      .getElementById(nextSectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      className="absolute bottom-10 z-30 flex justify-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.button
        onClick={handleScroll}
        animate={{ y: [0, 12, 0] }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{
          scale: 1.25
        }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center 
                   w-14 h-14 rounded-full 
                   text-white transition-all duration-300"
      >
        {/* Glow Ring */}
        <motion.span
          className="absolute inset-0 rounded-full bg-white/10 blur-md"
          whileHover={{ opacity: 1, scale: 1.3 }}
          initial={{ opacity: 0.4 }}
          transition={{ duration: 0.3 }}
        />

        <FaArrowDown className="text-2xl relative z-10 drop-shadow-lg" />
      </motion.button>
    </motion.div>
  );
};

export default ScrollDownArrow;
