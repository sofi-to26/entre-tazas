import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../db/firebaseConfig';
import { logout } from './Auth';
import { CheckCircle, Trash2, LogOut, Clock, Package, TrendingUp, ShoppingBag } from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!db) return;
    const qOrders = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('Error al cargar pedidos:', err);
    });

    const qComments = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubComments = onSnapshot(qComments, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('Error al cargar comentarios:', err);
    });

    return () => {
      unsubOrders();
      unsubComments();
    };
  }, []);

  const confirmOrder = async (id) => {
    if (!db) return;
    await updateDoc(doc(db, 'orders', id), { status: 'confirmado' });
  };

  const deleteOrder = async (id) => {
    if (!db) return;
    if (window.confirm('Eliminar este pedido?')) {
      await deleteDoc(doc(db, 'orders', id));
    }
  };

  const deleteComment = async (id) => {
    if (!db) return;
    if (window.confirm('¿Eliminar este comentario?')) {
      await deleteDoc(doc(db, 'comments', id));
    }
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  // Stats
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmado').length;
  const pendingOrders = orders.filter(o => o.status === 'pendiente').length;

  const totalRevenue = orders
    .filter(o => o.status === 'confirmado')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Top products
  const productCount = {};
  orders.forEach(o => {
    (o.products || []).forEach(p => {
      productCount[p.nombre] = (productCount[p.nombre] || 0) + (p.quantity || 1);
    });
  });
  const topProducts = Object.entries(productCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#162444] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-wide">Entre Tazas Admin</h1>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
          <LogOut size={16} /> Salir
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-bold text-sm tracking-wider uppercase transition-colors ${
              activeTab === 'orders' ? 'text-[#162444] border-b-2 border-[#162444]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Gestión de Pedidos
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 font-bold text-sm tracking-wider uppercase transition-colors ${
              activeTab === 'comments' ? 'text-[#162444] border-b-2 border-[#162444]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Gestión de Comentarios
          </button>
        </div>

        {activeTab === 'orders' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Package size={20} />} label="Total Pedidos" value={totalOrders} color="bg-blue-50 text-blue-600" />
              <StatCard icon={<Clock size={20} />} label="Pendientes" value={pendingOrders} color="bg-amber-50 text-amber-600" />
              <StatCard icon={<CheckCircle size={20} />} label="Confirmados" value={confirmedOrders} color="bg-green-50 text-green-600" />
              <StatCard icon={<TrendingUp size={20} />} label="Ingresos" value={`$${totalRevenue.toFixed(2)}`} color="bg-purple-50 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-[#162444] flex items-center gap-2 mb-4">
                  <ShoppingBag size={18} className="text-[#C5A880]" /> Top Productos
                </h3>
                {topProducts.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin datos aun</p>
                ) : (
                  <ul className="space-y-3">
                    {topProducts.map(([name, count], i) => (
                      <li key={name} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          <span className="font-bold text-[#C5A880] mr-2">#{i + 1}</span>
                          {name}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Orders Table */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  {['all', 'pendiente', 'confirmado'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        filter === f
                          ? 'bg-[#162444] text-white shadow-md'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-[#C5A880]'
                      }`}
                    >
                      {f === 'all' ? 'Todos' : f === 'pendiente' ? 'Pendientes' : 'Confirmados'}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400 font-medium">No hay pedidos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filtered.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onConfirm={confirmOrder}
                        onDelete={deleteOrder}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-[#162444]">Comentarios de Usuarios</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold">Nombre</th>
                    <th className="px-6 py-4 font-bold">Calificación</th>
                    <th className="px-6 py-4 font-bold">Comentario</th>
                    <th className="px-6 py-4 font-bold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                        No hay comentarios registrados
                      </td>
                    </tr>
                  ) : (
                    comments.map(comment => (
                      <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{comment.fecha}</td>
                        <td className="px-6 py-4 font-bold text-[#162444] whitespace-nowrap">{comment.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-dorado/10 text-dorado font-bold px-2.5 py-1 rounded-full text-xs">
                            {comment.estrellas} / 5
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 italic">"{comment.texto}"</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className={`inline-flex p-2 rounded-lg mb-2 ${color}`}>{icon}</div>
    <p className="text-2xl font-black text-[#162444]">{value}</p>
    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
  </div>
);

const OrderCard = ({ order, onConfirm, onDelete }) => {
  const isPending = order.status === 'pendiente';
  const date = order.timestamp?.toDate
    ? order.timestamp.toDate().toLocaleString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${isPending ? 'border-amber-200' : 'border-green-200'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isPending ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              {order.status}
            </span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <h4 className="font-bold text-[#162444] truncate">{order.clientName}</h4>
          <p className="text-xs text-gray-500 truncate">{order.address}</p>

          <div className="mt-3 space-y-1">
            {(order.products || []).map((p, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{p.quantity}x {p.nombre}</span>
                <span className="font-semibold text-gray-700">${(p.precio * p.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <span className="font-bold text-sm text-[#162444]">Total</span>
            <span className="font-black text-[#C5A880]">${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 flex-shrink-0">
          {isPending && (
            <button
              onClick={() => onConfirm(order.id)}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <CheckCircle size={14} /> Confirmar
            </button>
          )}
          <button
            onClick={() => onDelete(order.id)}
            className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
