import React, { useState, useRef } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const MenuCarousel = ({ onAddToCart }) => {
  const items = [
    {
      id: 'c1',
      titulo: 'Empanada y Pastel',
      desc: 'Jamón y Queso / Queso',
      precio: '$1.90 / $0.90',
      img: '/Comida_Carrusel2/Empanadas Jamon y Queso 1.90$ y Pastel de Queso 0.90$.png',
      options: [
        { label: 'Empanada J&Q ($1.90)', nombre: 'Empanada Jamón y Queso', precio: 1.90, id: 'd3' },
        { label: 'Pastel de Queso ($0.90)', nombre: 'Pastel de Queso', precio: 0.90, id: 'd5' }
      ]
    },
    {
      id: 'c2',
      titulo: 'Fondue Chocolate',
      desc: 'Waffles, fresas, marshmallows y cambur',
      precio: '$6.50',
      img: '/Comida_Carrusel2/Fondue Chocolate 6.50$.png',
      nombre: 'Fondue Chocolate',
      precioNum: 6.50,
      menuId: 'm5',
      imgScale: 'scale-125'
    },
    {
      id: 'c3',
      titulo: 'Café Marrón',
      desc: 'Grande / Pequeño',
      precio: '$2.30 / $1.30',
      img: '/Comida_Carrusel2/Cafe marrón Grande_Pequeño 2.30$_1.30$.png',
      options: [
        { label: 'Marrón Grande ($2.30)', nombre: 'Café Marrón (Grande)', precio: 2.30, id: 'b1-Grande' },
        { label: 'Marrón Pequeño ($1.30)', nombre: 'Café Marrón (Pequeño)', precio: 1.30, id: 'b1-Pequeño' }
      ]
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-16 bg-arena/20 dark:bg-[#0a1225] transition-colors duration-300" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 px-6"
      >
        <h2 className="text-3xl font-bold text-[#162444] dark:text-dorado mb-2">Recomendados de la Casa</h2>
        <div className="w-20 h-1 bg-[#C5A880] mx-auto rounded-full"></div>
      </motion.div>

      {/* Scroll track */}
      <div className="overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 pt-24 mt-2">
        <div className="flex gap-5 px-6 w-max mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
            >
              <Card item={item} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({ item, onAddToCart }) => {
  const [selectedOptIdx, setSelectedOptIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (item.options) {
      const opt = item.options[selectedOptIdx];
      onAddToCart(
        { id: opt.id, nombre: opt.nombre, precio: `${opt.precio}$` },
        null,
        opt.precio
      );
    } else {
      onAddToCart(
        { id: item.menuId, nombre: item.nombre, precio: `${item.precioNum}$` },
        null,
        item.precioNum
      );
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="w-[80vw] max-w-xs sm:w-72 bg-white dark:bg-[#0d1b35] dark:border-white/10 rounded-2xl shadow-lg flex-shrink-0 snap-center border border-gray-100 flex flex-col justify-between pt-24">
      <div>
        <div className="relative flex justify-center">
          <div className="w-48 h-48 rounded-full bg-white shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden -mt-40">
            <img
              src={item.img}
              alt={item.titulo}
              className={`w-full h-full object-cover transition-transform duration-300 ${item.imgScale || 'scale-105'}`}
            />
          </div>
        </div>

        <div className="p-4 pt-2">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-base font-bold text-[#162444] leading-tight">{item.titulo}</h3>
            <span className="text-[#C5A880] font-black text-sm whitespace-nowrap">{item.precio}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">{item.desc}</p>

          {item.options && (
            <div className="mb-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Seleccionar Opción
              </label>
              <select
                value={selectedOptIdx}
                onChange={(e) => setSelectedOptIdx(Number(e.target.value))}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 text-[#162444] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
              >
                {item.options.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-0.5 my-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="fill-current text-[#C5A880]" />
          ))}
        </div>

        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-[#162444] hover:bg-[#C5A880] hover:text-[#162444] text-white'
          }`}
        >
          <ShoppingCart size={14} />
          {added ? 'Agregado!' : 'Agregar a canasta'}
        </button>
      </div>
    </div>
  );
};

export default MenuCarousel;
