import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock } from 'lucide-react';

const images = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop'
];

// Steam particle animation
const SteamParticle = ({ delay = 0, x = 0 }) => (
  <motion.div
    className="absolute bottom-0 w-2 h-8 rounded-full bg-white/20 blur-sm"
    style={{ left: `${x}%` }}
    animate={{
      y: [-10, -60],
      opacity: [0, 0.7, 0],
      scaleX: [1, 1.8, 2.5],
    }}
    transition={{
      duration: 2.5,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />
);

const Hero = ({ openNow }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-corporativo">
      {images.map((img, index) => (
        <motion.div
          key={index}
          style={{ y }}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={img} alt="Hero" className="w-full h-full object-cover animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>
      ))}

      {/* Steam particles over hero */}
      <div className="absolute bottom-[35%] left-[48%] z-20 w-16 h-16 pointer-events-none">
        <SteamParticle delay={0} x={10} />
        <SteamParticle delay={0.6} x={40} />
        <SteamParticle delay={1.2} x={70} />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        {/* Open/Closed Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border ${
            openNow
              ? 'bg-green-500/20 border-green-400/40 text-green-300'
              : 'bg-red-500/20 border-red-400/40 text-red-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${openNow ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <Clock size={13} />
          {openNow ? 'Abierto ahora' : 'Cerrado en este momento'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
        >
          ENTRE TAZAS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
          className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-light"
        >
          Cada taza cuenta una historia y queremos que la tuya comience con nosotros.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.a
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            href="#menu"
            className="relative overflow-hidden bg-dorado text-corporativo px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Ver Menú
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="#ubicacion"
            className="text-white/80 hover:text-dorado text-sm font-medium underline underline-offset-4 transition-colors"
          >
            ¿Dónde estamos?
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50"
      >
        <div className="w-[2px] h-8 bg-gradient-to-b from-white/50 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
};

export default Hero;