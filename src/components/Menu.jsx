import React, { useState } from 'react';
import { menuData } from '../data/menuData';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('desayunos');

  const tabs = [
    { id: 'desayunos', label: 'Desayunos' },
    { id: 'meriendas', label: 'Meriendas' },
    { id: 'bebidas', label: 'Bebidas' }
  ];

  return (
    <section id="menu" className="relative py-20 bg-arena overflow-hidden">
      {/* Left side decorative coffee cups */}
      <img 
        key={`left-${activeTab}`}
        src="/imagenes_tazas_cafe/izquierda.png" 
        alt="" 
        className="absolute left-0 top-0 h-full w-auto object-contain pointer-events-none select-none z-0 hidden md:block animate-left-image" 
      />

      {/* Right side decorative coffee cups */}
      <img 
        key={`right-${activeTab}`}
        src="/imagenes_tazas_cafe/derecha.png" 
        alt="" 
        className="absolute right-0 top-0 h-full w-auto object-contain pointer-events-none select-none z-0 hidden md:block animate-right-image" 
      />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-corporativo mb-2">Nuestro Menú</h2>
          <div className="w-24 h-1 bg-dorado mx-auto"></div>
        </div>

        <div className="flex justify-center gap-4 mb-10 border-b border-corporativo/20 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-corporativo text-white shadow-md' 
                  : 'text-corporativo hover:bg-corporativo/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {menuData[activeTab].map((item, idx) => (
            <div 
              key={item.id} 
              className="flex flex-col group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-end text-lg font-medium text-corporativo">
                <span className="group-hover:text-dorado transition-colors">{item.nombre}</span>
                <span className="dot-leader"></span>
                <span className="font-bold">{item.precio}</span>
              </div>
              {item.desc && <p className="text-sm text-gray-500 mt-1">{item.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;