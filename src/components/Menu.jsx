import React, { useState } from 'react';
import { menuData } from '../data/menuData';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useInventory } from '../hooks/useInventory';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: 'easeOut' }
  })
};

const Menu = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState('desayunos');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isAvailable } = useInventory();

  const tabs = [
    { id: 'desayunos', label: 'Desayunos' },
    { id: 'meriendas', label: 'Meriendas' },
    { id: 'bebidas', label: 'Bebidas' }
  ];

  return (
    <section id="menu" className="relative py-20 bg-arena dark:bg-[#0d1b35] overflow-hidden transition-colors duration-300">
      {/* Left side decorative coffee cups */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center z-0 hidden xl:flex pointer-events-none select-none">
        <img 
          key={`left-${activeTab}`}
          src="/imagenes_tazas_cafe/izquierda.png" 
          alt="" 
          className="w-[24vw] max-w-[380px] h-auto object-contain animate-left-image" 
        />
      </div>

      {/* Right side decorative coffee cups */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center z-0 hidden xl:flex pointer-events-none select-none">
        <img 
          key={`right-${activeTab}`}
          src="/imagenes_tazas_cafe/derecha.png" 
          alt="" 
          className="w-[24vw] max-w-[380px] h-auto object-contain animate-right-image" 
        />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-corporativo dark:text-dorado mb-2">Nuestro Menú</h2>
          <div className="w-24 h-1 bg-dorado mx-auto"></div>
        </motion.div>

        <div className="flex justify-center gap-4 mb-10 border-b border-corporativo/20 dark:border-white/10 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-corporativo dark:bg-dorado dark:text-corporativo text-white shadow-md' 
                  : 'text-corporativo dark:text-gray-300 hover:bg-corporativo/10 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuData[activeTab].map((item, idx) => {
            const available = isAvailable(item.id);
            return (
              <motion.div
                key={item.id}
                custom={idx}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeUp}
                className={`flex flex-col p-4 rounded-xl shadow-sm border transition-all group relative ${
                  available
                    ? 'bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border-gray-100 dark:border-white/10'
                    : 'bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/5 opacity-70'
                }`}
              >
                {!available && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Agotado
                  </span>
                )}
                <div className="flex justify-between items-start h-full">
                  <div className="flex-1 pr-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className={`text-lg font-bold transition-colors ${
                        available
                          ? 'text-corporativo dark:text-white group-hover:text-dorado'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {item.nombre}
                      </h3>
                      {item.desc && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>}
                    </div>
                    <p className={`font-bold text-lg mt-2 ${
                      available ? 'text-dorado' : 'text-gray-400'
                    }`}>{item.precio}</p>
                  </div>

                  <div className="flex flex-col justify-center h-full min-h-[40px]">
                    {item.precio.includes('/') ? (
                      <div className="flex flex-col gap-1.5">
                        <button
                          disabled={!available}
                          onClick={() => available && onAddToCart(item, 'Grande', 2.30)}
                          className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-all shadow-sm whitespace-nowrap ${
                            available
                              ? 'bg-corporativo hover:bg-dorado hover:text-corporativo active:scale-95'
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          + Grande
                        </button>
                        <button
                          disabled={!available}
                          onClick={() => available && onAddToCart(item, 'Pequeño', 1.30)}
                          className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-all shadow-sm whitespace-nowrap ${
                            available
                              ? 'bg-corporativo hover:bg-dorado hover:text-corporativo active:scale-95'
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          + Pequeño
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!available}
                        onClick={() => available && onAddToCart(item)}
                        className={`px-4 py-2 text-white text-sm font-bold rounded-lg transition-all shadow-sm ${
                          available
                            ? 'bg-corporativo hover:bg-dorado hover:text-corporativo active:scale-95'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {available ? '+ Agregar' : 'No disponible'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Menu;