import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselItems = [
  {
    title: 'Taza de Café Caliente',
    subtitle: 'Un café aromático y recién colado para despertar tus sentidos.',
    img: '/imagenes_carrusel/taza_cafe.png'
  },
  {
    title: 'Arepa Rellena',
    subtitle: 'La tradicional arepa venezolana, dorada y con el relleno perfecto.',
    img: '/imagenes_carrusel/arepa_rellena.png'
  },
  {
    title: 'Empanada Doradita',
    subtitle: 'Crujiente masa de maíz frita rellena de puro sabor casero.',
    img: '/imagenes_carrusel/empanada.png'
  },
  {
    title: 'Tequeños Tradicionales',
    subtitle: 'Deditos de queso envueltos en masa crujiente, el antojo perfecto.',
    img: '/imagenes_carrusel/tequeños.png'
  },
  {
    title: 'Arepa Especial de la Casa',
    subtitle: 'Masa fina y tostada con una deliciosa combinación de rellenos.',
    img: '/imagenes_carrusel/arepa_rellena_2.png'
  },
  {
    title: 'Desayuno Criollo Completo',
    subtitle: 'El balance ideal para iniciar el día con toda la energía.',
    img: '/imagenes_carrusel/desayuno_completo.png'
  },
  {
    title: 'Desayuno Especial',
    subtitle: 'Plato variado y sabroso con lo mejor de nuestra cocina.',
    img: '/imagenes_carrusel/desayuno_completo_2.png'
  },
  {
    title: 'Gran Combo Entre Tazas',
    subtitle: 'Exquisitos pastelitos crujientes acompañados de malta y salsas artesanales.',
    img: '/imagenes_carrusel/desayuno_completo_pastelitos_jugo_malta_salsa.png'
  },
  {
    title: 'Día Especial',
    subtitle: 'Celebra y comparte momentos memorables en un gran ambiente.',
    img: '/imagenes_carrusel/dia_especial.png'
  },
  {
    title: 'Pan de Jamón Artesanal',
    subtitle: 'El clásico pan navideño y tradicional con el toque de la casa.',
    img: '/imagenes_carrusel/pan_de_jamon.png'
  }
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    // Spacing configuration
    const spacing = isMobile ? 80 : 160;
    const translateX = diff * spacing;
    const translateZ = -absDiff * (isMobile ? 80 : 160);
    const rotateY = diff < 0 ? 40 : diff > 0 ? -40 : 0;
    
    // Scale progressively reduced
    const scale = 1 - Math.min(absDiff * (isMobile ? 0.12 : 0.1), 0.35);
    
    // Z-index cascading descending
    const zIndex = 50 - absDiff;
    
    // Visibility window
    const opacity = absDiff > (isMobile ? 2 : 3) ? 0 : 1;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      opacity,
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  return (
    <section id="experiencia" className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-corporativo tracking-wide">
            La Experiencia
          </h2>
          <div className="h-1 w-20 bg-dorado mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 max-w-md font-light">
            Sumérgete en la atmósfera de Entre Tazas a través de nuestra galería interactiva en 3D.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative w-full max-w-6xl h-[420px] md:h-[520px] flex items-center justify-center perspective-1200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D Wrapper */}
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {carouselItems.map((item, idx) => {
              const diff = idx - activeIndex;
              const isActive = diff === 0;

              return (
                <div
                  key={idx}
                  onClick={() => !isActive && setActiveIndex(idx)}
                  className="absolute w-[240px] h-[340px] md:w-[320px] md:h-[440px] cursor-pointer select-none rounded-2xl overflow-hidden shadow-2xl"
                  style={getCardStyle(idx)}
                >
                  {/* Image */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-2xl pointer-events-none"
                  />

                  {/* Dark overlay for inactive images (progressively darker) */}
                  <div
                    className="absolute inset-0 bg-black rounded-2xl transition-opacity duration-600 pointer-events-none"
                    style={{
                      opacity: isActive ? 0 : Math.min(Math.abs(diff) * 0.35, 0.7),
                    }}
                  />

                  {/* Text Overlay for Active Card only */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 rounded-2xl transition-all duration-600 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-dorado mb-1 drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-200 font-light leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Chevrons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-12 z-50 bg-white/80 hover:bg-dorado hover:text-white text-corporativo p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 border border-gray-200/50"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-12 z-50 bg-white/80 hover:bg-dorado hover:text-white text-corporativo p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 border border-gray-200/50"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators/Dots */}
        <div className="flex gap-2.5 mt-8 z-40">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === activeIndex 
                  ? 'w-8 bg-dorado' 
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;