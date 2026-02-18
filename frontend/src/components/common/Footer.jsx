    import React from 'react';
import { FaBrain } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-black/80 text-white p-10 backdrop-blur-xl w-full border-t border-white/10">
      <div className="footer max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <aside>
          <FaBrain className="text-5xl text-primary mb-2" />
          <p className="font-bold text-lg text-white">AlgoSelector Inc.<br/>Meta-Learning for Everyone.</p>
          <p className="text-sm text-white/70">© {new Date().getFullYear()} - All rights reserved</p>
        </aside> 
        <nav className="flex flex-col gap-2">
          <h6 className="footer-title text-white opacity-100">Services</h6> 
          <a className="link link-hover hover:text-primary text-gray-200">AutoML Pipeline</a>
          <a className="link link-hover hover:text-primary text-gray-200">Dataset Analysis</a>
        </nav> 
        <nav className="flex flex-col gap-2">
          <h6 className="footer-title text-white opacity-100">Legal</h6> 
          <a className="link link-hover hover:text-primary text-gray-200">Terms of use</a>
          <a className="link link-hover hover:text-primary text-gray-200">Privacy policy</a>
        </nav>
      </div>
    </div>
  );
};

export default Footer;