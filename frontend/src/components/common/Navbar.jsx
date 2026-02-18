import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';

const Navbar = ({ onLoginClick }) => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 w-full z-50 px-8 py-4 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div className="text-2xl font-black tracking-tighter flex items-center gap-2 text-white">
        <FaBrain className="text-primary" /> AlgoSelector
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-6 text-sm font-semibold text-white">
          <button onClick={() => scrollToSection('section-how')} className="hover:text-primary transition-colors">How it Works</button>
          <button onClick={() => scrollToSection('section-explain')} className="hover:text-primary transition-colors">Explainability</button>
        </div>
        <button 
          onClick={onLoginClick} 
          className="btn btn-primary btn-sm rounded-full px-6 border-none text-white font-bold"
        >
          Login
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;