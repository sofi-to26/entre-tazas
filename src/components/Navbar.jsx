import React, { useState, useEffect } from 'react';
import { Coffee, Menu } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <Coffee size={28} />
          <span className="text-xl font-bold tracking-widest uppercase">Entre Tazas</span>
        </div>
        <div className="hidden md:flex gap-6 text-white font-medium text-sm tracking-wide">
          <a href="#menu" className="hover:text-dorado transition-colors">Menú</a>
          <a href="#experiencia" className="hover:text-dorado transition-colors">Experiencia</a>
          <a href="#comentarios" className="hover:text-dorado transition-colors">Opiniones</a>
          <a href="#ubicacion" className="hover:text-dorado transition-colors">Ubicación</a>
        </div>
        <button className="md:hidden text-white"><Menu /></button>
      </div>
    </nav>
  );
};

export default Navbar;