import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingCart, Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ cartCount, onOpenCart, darkMode, toggleDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#menu', label: 'Menú' },
    { href: '#experiencia', label: 'Experiencia' },
    { href: '#comentarios', label: 'Opiniones' },
    { href: '#ubicacion', label: 'Ubicación' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <Coffee size={28} />
            <span className="text-xl font-bold tracking-widest uppercase">Entre Tazas</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center text-white font-medium text-sm tracking-wide">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:text-dorado transition-colors">
                {link.label}
              </a>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-dorado"
              title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="ml-2 relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ShoppingCart size={22} className="text-white hover:text-dorado transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-dorado text-corporativo text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-corporativo">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3 text-white">
            <button onClick={toggleDarkMode} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onOpenCart} className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
              <ShoppingCart size={22} className="text-white hover:text-dorado transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-dorado text-corporativo text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-corporativo">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(o => !o)} className="text-white">
              {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Full Screen Glassmorphism) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-40 top-[70px] glass-nav flex flex-col items-center justify-center gap-8 border-t border-white/10"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="text-white hover:text-dorado transition-colors font-bold tracking-widest text-2xl uppercase"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;