// src/components/dashboard/LogoutModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top Border Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-500" />

            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <FaSignOutAlt className="text-2xl ml-1" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Sign Out</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to end your session?
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  Confirm <FaSignOutAlt className="text-xs" />
                </button>
              </div>
            </div>
            
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <FaTimes />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;