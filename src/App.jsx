import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Comments from './components/Comments';
import Footer from './components/Footer';
import FAB from './components/FAB';

function App() {
  return (
    <div className="font-sans text-gray-800 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <Gallery />
        <Comments />
      </main>
      <Footer />
      <FAB />
    </div>
  );
}
export default App;