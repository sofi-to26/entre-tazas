import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';

const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide preloader after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation to finish before unmounting
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#0a1225]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#C5A880] blur-xl opacity-20 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 bg-[#162444] dark:bg-white/5 rounded-full flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-2xl relative z-10">
              <Coffee size={40} className="text-[#C5A880]" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h1 className="text-2xl font-bold tracking-widest text-[#162444] dark:text-dorado uppercase font-serif">
              Entre Tazas
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-[0.2em] uppercase">
              Preparando tu café...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
