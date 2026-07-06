import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, User, Send } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../db/firebaseConfig';
import { motion, useInView } from 'framer-motion';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [nombre, setNombre] = useState('');
  const [texto, setTexto] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [hoverEstrellas, setHoverEstrellas] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('Error al cargar comentarios:', err);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !texto.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (db) {
      try {
        await addDoc(collection(db, 'comments'), {
          nombre: nombre.trim(),
          texto: texto.trim(),
          estrellas,
          fecha: new Date().toISOString().split('T')[0],
          timestamp: serverTimestamp()
        });
        
        setNombre('');
        setTexto('');
        setEstrellas(5);
        setError('');
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('Error al guardar comentario:', err);
        setError('Hubo un error al guardar tu comentario. Inténtalo de nuevo.');
      }
    } else {
      setError('La base de datos no está disponible en este momento.');
    }
  };

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="comentarios" ref={sectionRef} className="py-20 bg-arena/40 dark:bg-[#0d1b35] transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-corporativo dark:text-dorado tracking-wide flex items-center justify-center gap-2">
            <MessageSquare className="text-dorado" /> Opiniones y Reseñas
          </h2>
          <div className="h-1 w-24 bg-dorado mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto font-light">
            Comparte tu experiencia en Entre Tazas. Tus comentarios nos ayudan a mejorar cada día.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 bg-white dark:bg-[#0a1225] dark:border-white/10 p-6 rounded-2xl shadow-xl border border-gray-100 relative z-10"
          >
            <h3 className="text-2xl font-bold text-corporativo dark:text-white mb-6">Déjanos tu reseña</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-corporativo dark:text-gray-200 mb-2">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-dorado/50 focus:border-dorado transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-corporativo mb-2">Calificación</label>
                <div className="flex gap-1.5 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEstrellas(star)}
                      onMouseEnter={() => setHoverEstrellas(star)}
                      onMouseLeave={() => setHoverEstrellas(0)}
                      className="text-2xl focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= (hoverEstrellas || estrellas)
                            ? 'fill-dorado text-dorado'
                            : 'text-gray-300'
                        } transition-colors duration-150`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2 font-medium">({estrellas} / 5)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-corporativo dark:text-gray-200 mb-2">Comentario</label>
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-dorado/50 focus:border-dorado transition-colors resize-none"
                  placeholder="Escribe tu opinión aquí..."
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>
              )}

              {success && (
                <p className="text-green-600 text-sm font-semibold animate-bounce">
                  ¡Gracias! Tu comentario ha sido agregado.
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-corporativo hover:bg-dorado hover:text-corporativo text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 shadow-md transform active:scale-95"
              >
                Enviar Comentario <Send size={16} />
              </button>
            </form>
          </motion.div>

          {/* Comments List */}
          <div className="lg:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
                <p className="text-gray-500 dark:text-gray-400 font-light">No hay comentarios aún. ¡Sé el primero en escribir uno!</p>
              </div>
            ) : (
              comments.map((comment, idx) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white dark:bg-[#0a1225] dark:border-white/10 p-6 rounded-2xl shadow-md border border-gray-100/50 flex flex-col justify-between relative group hover:shadow-lg transition-shadow"
                >
                  {/* Top: Name, Date & Rating */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-corporativo/10 dark:bg-dorado/10 flex items-center justify-center text-corporativo dark:text-dorado font-bold">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-corporativo dark:text-white">{comment.nombre}</h4>
                        <span className="text-xs text-gray-400">{comment.fecha}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-dorado/10 px-2.5 py-1 rounded-full">
                      <span className="text-sm font-bold text-dorado">{comment.estrellas}</span>
                      <Star size={14} className="fill-dorado text-dorado" />
                    </div>
                  </div>

                  {/* Mid: Comment text */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-sm italic">
                    "{comment.texto}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comments;
