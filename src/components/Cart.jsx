import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, Send } from 'lucide-react';

const Cart = ({ cart, isOpen, onClose, updateQuantity, removeFromCart, clearCart }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [validated, setValidated] = useState(true);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim()) {
      setValidated(false);
      return;
    }
    setValidated(true);

    // Format WhatsApp message
    const lineBreak = '\n';
    let message = `*ENTRE TAZAS - NUEVO PEDIDO*${lineBreak}`;
    message += `----------------------------------${lineBreak}`;
    message += `*Cliente:* ${nombre.trim()}${lineBreak}`;
    message += `*Dirección:* ${direccion.trim()}${lineBreak}`;
    message += `----------------------------------${lineBreak}${lineBreak}`;
    message += `*Detalle del Pedido:*${lineBreak}`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.nombre} ($${(item.precio * item.quantity).toFixed(2)})${lineBreak}`;
    });
    
    message += `${lineBreak}*Total a Pagar:* $${total.toFixed(2)}${lineBreak}`;
    message += `----------------------------------${lineBreak}`;
    message += `Muchas gracias por tu compra.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/584166443465?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all ease-in-out duration-300">
          <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-scroll">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-corporativo flex items-center gap-2">
                  <ShoppingBag className="text-dorado" /> Mi Carrito
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-corporativo transition-colors"
                    onClick={onClose}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
                    <p className="text-gray-400 text-sm mt-1">¡Agrega algo delicioso del menú!</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-100">
                      {cart.map((item) => (
                        <li key={item.cartItemId} className="py-6 flex">
                          <div className="flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-semibold text-corporativo">
                                <h3>{item.nombre}</h3>
                                <p className="ml-4">${(item.precio * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-400">${item.precio.toFixed(2)} c/u</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartItemId, -1)}
                                  className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 font-semibold text-corporativo">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartItemId, 1)}
                                  className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50">
                <div className="flex justify-between text-base font-bold text-corporativo mb-6">
                  <p>Total</p>
                  <p className="text-dorado text-xl">${total.toFixed(2)}</p>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-corporativo mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-dorado/50 focus:border-dorado transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-corporativo mb-1">Dirección de Envío *</label>
                    <textarea
                      required
                      rows="2"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Ej. Av. Principal, Res. El Café, Apto 4B"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-dorado/50 focus:border-dorado transition-colors resize-none"
                    />
                  </div>

                  {!validated && (
                    <p className="text-red-500 text-sm font-medium">Por favor, completa todos los campos obligatorios.</p>
                  )}

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-corporativo hover:bg-dorado hover:text-corporativo text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 shadow-md transform active:scale-95"
                    >
                      <Send size={16} /> Enviar a WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
