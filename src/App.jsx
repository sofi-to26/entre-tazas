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
    <div className="font-sans text-gray-800 antialiased">
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
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