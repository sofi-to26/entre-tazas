import React, { useState, useEffect } from 'react';
import { Coffee, Menu, ShoppingCart } from 'lucide-react';

const Navbar = ({ cartCount, onOpenCart }) => {
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
        <div className="hidden md:flex gap-6 items-center text-white font-medium text-sm tracking-wide">
          <a href="#menu" className="hover:text-dorado transition-colors">Menú</a>
          <a href="#experiencia" className="hover:text-dorado transition-colors">Experiencia</a>
          <a href="#comentarios" className="hover:text-dorado transition-colors">Opiniones</a>
          <a href="#ubicacion" className="hover:text-dorado transition-colors">Ubicación</a>
          
          <button 
            onClick={onOpenCart}
            className="ml-4 relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ShoppingCart size={22} className="text-white hover:text-dorado transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-dorado text-corporativo text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-corporativo">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-4 text-white">
          <button 
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ShoppingCart size={22} className="text-white hover:text-dorado transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-dorado text-corporativo text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-corporativo">
                {cartCount}
              </span>
            )}
          </button>
          <button className="text-white"><Menu /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;