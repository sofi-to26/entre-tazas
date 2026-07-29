import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, CheckCircle } from 'lucide-react';

/**
 * Toast notification que aparece cuando se agrega un ítem al carrito.
 * Recibe una cola de toasts: [{ id, nombre }]
 */
const Toast = ({ toasts }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-2.5 bg-corporativo text-white px-5 py-3 rounded-2xl shadow-2xl border border-dorado/30 backdrop-blur-sm"
          >
            <CheckCircle size={18} className="text-dorado flex-shrink-0" />
            <span className="text-sm font-semibold">
              <span className="text-dorado">{t.nombre}</span> agregado al carrito
            </span>
            <ShoppingCart size={16} className="opacity-60 flex-shrink-0" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
