import React, { useState, useEffect } from 'react';
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

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('entre-tazas-theme') === 'dark';
  });

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

  const addToCart = (item, optionName = null, priceOverride = null) => {
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
    setIsCartOpen(true);
  };

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
      />
      <main>
        <Hero />
        <MenuCarousel onAddToCart={addToCart} />
        <Menu onAddToCart={addToCart} />
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
    </div>
  );
}

export default App;