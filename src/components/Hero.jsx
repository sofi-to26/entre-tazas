import React, { useState, useEffect } from 'react';

const images = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop'
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-corporativo">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={img} alt="Hero" className="w-full h-full object-cover animate-ken-burns" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
          ENTRE TAZAS
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-light">
          Cada taza cuenta una historia y queremos que la tuya comience con nosotros.
        </p>
        <a href="#menu" className="relative overflow-hidden bg-dorado text-corporativo px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors group">
          <span className="relative z-10">Ver Menú</span>
          <div className="absolute inset-0 h-full w-full bg-white/30 transform -skew-x-12 animate-shimmer group-hover:block" />
        </a>
      </div>
    </div>
  );
};

export default Hero;        