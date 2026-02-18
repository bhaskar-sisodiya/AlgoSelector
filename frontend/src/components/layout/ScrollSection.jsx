import React from 'react';
import { motion } from 'framer-motion';
import ScrollDownArrow from '../common/ScrollDownArrow';

const ScrollSection = ({ 
  id, 
  nextSectionId, 
  bgImage, 
  children, 
  align = 'center', 
  showArrow = false 
}) => {
  const hasImage = Boolean(bgImage);

  return (
    <section 
      id={id} 
      className={`relative h-screen w-full snap-start overflow-hidden flex flex-col justify-center items-center ${!hasImage ? 'bg-gray-900' : 'bg-black'}`}
    >
      
      {/* Background Layer */}
      {hasImage && (
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />
        </motion.div>
      )}

      {/* Content Layer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.5 }}
        className={`relative z-20 container mx-auto px-6 ${align === 'left' ? 'text-left' : 'text-center'} text-white`}
      >
        {children}
      </motion.div>

      {/* Navigation Arrow */}
      {showArrow && <ScrollDownArrow nextSectionId={nextSectionId} />}
    </section>
  );
};

export default ScrollSection;