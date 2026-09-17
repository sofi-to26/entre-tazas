import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Comments from './components/Comments';
import Footer from './components/Footer';
import FAB from './components/FAB';
import Cart from './components/Cart';
import MenuCarousel from './components/MenuCarousel';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';
import Preloader from './components/Preloader';
import HowToOrder from './components/HowToOrder';
import Toast from './components/Toast';
import { useStoreStatus } from './hooks/useStoreStatus';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('entre-tazas-theme') === 'dark';
  });
  const [activeSection, setActiveSection] = useState('');
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  const { openNow, tempClosed } = useStoreStatus();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('entre-tazas-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('entre-tazas-theme', 'light');
    }
  }, [darkMode]);

  // Check hash for admin route
  useEffect(() => {
    const checkHash = () => setIsAdmin(window.location.hash === '#/admin');
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // IntersectionObserver for active nav section
  useEffect(() => {
    const sectionIds = ['menu', 'experiencia', 'comentarios', 'ubicacion'];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [loading]);

  // Show toast notification
  const showToast = useCallback((nombre) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, nombre }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const addToCart = useCallback((item, optionName = null, priceOverride = null) => {
    setCart(prevCart => {
      const cartItemId = optionName ? `${item.id}-${optionName}` : item.id;
      const displayName = optionName ? `${item.nombre} (${optionName})` : item.nombre;

      let finalPrice = 0;
      if (priceOverride) {
        finalPrice = priceOverride;
      } else {
        const cleanPrice = item.precio.replace('$', '').trim();
        finalPrice = parseFloat(cleanPrice);
      }

      const existingIndex = prevCart.findIndex(cartItem => cartItem.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, {
          cartItemId,
          id: item.id,
          nombre: displayName,
          precio: finalPrice,
          quantity: 1
        }];
      }
    });

    // Show toast instead of opening cart automatically
    const displayName = optionName ? `${item.nombre} (${optionName})` : item.nombre;
    showToast(displayName);
  }, [showToast]);

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => setCart([]);

  // Admin route
  if (isAdmin) {
    if (!adminUser) {
      return <Auth onAuth={(user) => setAdminUser(user)} />;
    }
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={() => {
          setAdminUser(null);
          window.location.hash = '';
        }}
      />
    );
  }

  // Public site
  return (
    <div className="font-sans text-gray-800 antialiased bg-white dark:bg-[#0a1225] dark:text-gray-100 transition-colors duration-300">
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(d => !d)}
        activeSection={activeSection}
      />

          {/* Closed banner */}
          {tempClosed && (
            <div className="fixed top-0 left-0 w-full z-[60] bg-red-600 text-white text-center py-2 text-sm font-semibold">
              🚫 En este momento no estamos tomando pedidos. ¡Volvemos pronto!
            </div>
          )}

          <main>
            <Hero openNow={openNow} />
            <MenuCarousel onAddToCart={addToCart} />
            <Menu onAddToCart={addToCart} />
            <HowToOrder />
            <Gallery />
            <Comments />
          </main>
          <Footer />
          <FAB />
          <Cart
            cart={cart}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
          <Toast toasts={toasts} />
    </div>
  );
}

export default App;