import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ShoppingBag, Send } from 'lucide-react';

const steps = [
  {
    icon: <UtensilsCrossed size={28} className="text-dorado" />,
    title: '1. Elige lo que te gusta',
    desc: 'Explora nuestro menú interactivo de desayunos, meriendas y bebidas exclusivas.'
  },
  {
    icon: <ShoppingBag size={28} className="text-dorado" />,
    title: '2. Revisa tu Canasta',
    desc: 'Agrega tus productos favoritos y personaliza las opciones a tu gusto.'
  },
  {
    icon: <Send size={28} className="text-dorado" />,
    title: '3. Envía por WhatsApp',
    desc: 'Ingresa tu nombre y dirección; tu pedido llegará formateado directo a nuestra atención al cliente.'
  }
];

const HowToOrder = () => {
  return (
    <section className="py-16 bg-white dark:bg-[#0a1225] border-y border-gray-100 dark:border-white/5 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-corporativo dark:text-white mb-2">¿Cómo hacer tu pedido?</h2>
          <div className="w-20 h-1 bg-dorado mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-arena/20 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-corporativo flex items-center justify-center mb-4 shadow-md">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-corporativo dark:text-dorado mb-2">{step.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
