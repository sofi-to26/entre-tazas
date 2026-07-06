import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebaseConfig';
import { logout } from './Auth';
import {
  CheckCircle, Trash2, LogOut, Clock, Package,
  TrendingUp, ShoppingBag, Download, MessageSquare, Bell, ToggleLeft, ToggleRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import { menuData } from '../data/menuData';

// ── Notificación sonora ──────────────────────────────────────────
const playDing = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) { /* sin soporte */ }
};

const COLORS = ['#C5A880', '#162444', '#8B6914', '#1e3a6e', '#d4af37'];

// ── Componente Principal ────────────────────────────────────────
const AdminDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);
  const [inventory, setInventory] = useState({});
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('orders');
  const prevOrderCount = useRef(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  useEffect(() => {
    if (!db) return;

    const qOrders = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(data);
      if (prevOrderCount.current !== null && data.length > prevOrderCount.current) {
        playDing();
        setNewOrderAlert(true);
        setTimeout(() => setNewOrderAlert(false), 4000);
      }
      prevOrderCount.current = data.length;
    });

    const qComments = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubComments = onSnapshot(qComments, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Seed inventory once, then subscribe
    const allProducts = [...menuData.desayunos, ...menuData.meriendas, ...menuData.bebidas];
    const seedAndSubscribe = async () => {
      for (const item of allProducts) {
        const ref = doc(db, 'inventory', item.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            id: item.id,
            nombre: item.nombre,
            categoria: item.id.startsWith('d') ? 'desayunos' : item.id.startsWith('m') ? 'meriendas' : 'bebidas',
            available: true,
          });
        }
      }
    };
    seedAndSubscribe();

    const unsubInventory = onSnapshot(collection(db, 'inventory'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setInventory(map);
    });

    return () => { unsubOrders(); unsubComments(); unsubInventory(); };
  }, []);

  const confirmOrder = async (id) => {
    if (!db) return;
    await updateDoc(doc(db, 'orders', id), { status: 'confirmado' });
  };

  const deleteOrder = async (id) => {
    if (!db) return;
    if (window.confirm('¿Eliminar este pedido?')) await deleteDoc(doc(db, 'orders', id));
  };

  const deleteComment = async (id) => {
    if (!db) return;
    if (window.confirm('¿Eliminar este comentario?')) await deleteDoc(doc(db, 'comments', id));
  };

  const toggleAvailability = async (productId, current) => {
    if (!db) return;
    await updateDoc(doc(db, 'inventory', productId), { available: !current });
  };

  // ── Exportar a Excel ──
  const exportToExcel = useCallback(() => {
    const rows = orders
      .filter(o => o.status === 'confirmado')
      .map(o => ({
        'Fecha': o.timestamp?.toDate?.().toLocaleString('es-VE') || '—',
        'Cliente': o.clientName || '—',
        'Dirección': o.address || '—',
        'Productos': (o.products || []).map(p => `${p.quantity}x ${p.nombre}`).join(', '),
        'Total ($)': (o.total || 0).toFixed(2),
      }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos Confirmados');
    XLSX.writeFile(wb, `EnteTazas_Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
  }, [orders]);

  const handleLogout = async () => { await logout(); onLogout(); };
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmado').length;
  const pendingOrders = orders.filter(o => o.status === 'pendiente').length;
  const totalRevenue = orders.filter(o => o.status === 'confirmado').reduce((s, o) => s + (o.total || 0), 0);

  // ── Top Products ──
  const productCount = {};
  orders.forEach(o => (o.products || []).forEach(p => {
    productCount[p.nombre] = (productCount[p.nombre] || 0) + (p.quantity || 1);
  }));
  const topProducts = Object.entries(productCount).sort(([, a], [, b]) => b - a).slice(0, 5);

  // ── Ventas por día (últimos 7 días) ──
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric' });
  });
  const salesByDay = last7.map(label => {
    const dayOrders = orders.filter(o => {
      const d = o.timestamp?.toDate?.();
      if (!d) return false;
      return d.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric' }) === label;
    });
    return { day: label, ventas: dayOrders.reduce((s, o) => s + (o.total || 0), 0) };
  });

  // ── Pie chart: pedidos por estado ──
  const pieData = [
    { name: 'Pendientes', value: pendingOrders },
    { name: 'Confirmados', value: confirmedOrders },
  ].filter(d => d.value > 0);

  // ── Top 5 productos para barra ──
  const barData = topProducts.map(([name, count]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, cantidad: count }));

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#162444] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-wide">Entre Tazas Admin</h1>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          {newOrderAlert && (
            <span className="flex items-center gap-1.5 bg-dorado text-corporativo text-xs font-bold px-3 py-1 rounded-full animate-bounce">
              <Bell size={13} /> ¡Nuevo pedido!
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-[#C5A880] hover:bg-[#d4af37] text-[#162444] px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            <Download size={16} /> Exportar Excel
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package size={20} />} label="Total Pedidos" value={totalOrders} color="bg-blue-50 text-blue-600" />
          <StatCard icon={<Clock size={20} />} label="Pendientes" value={pendingOrders} color="bg-amber-50 text-amber-600" />
          <StatCard icon={<CheckCircle size={20} />} label="Confirmados" value={confirmedOrders} color="bg-green-50 text-green-600" />
          <StatCard icon={<TrendingUp size={20} />} label="Ingresos" value={`$${totalRevenue.toFixed(2)}`} color="bg-purple-50 text-purple-600" />
        </div>

        {/* Charts Row */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart: Ventas por día */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="font-bold text-[#162444] mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#C5A880]" /> Ventas Últimos 7 Días ($)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesByDay} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Ventas']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #eee', fontSize: 12 }}
                  />
                  <Bar dataKey="ventas" fill="#C5A880" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Estado de pedidos */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="font-bold text-[#162444] mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#C5A880]" /> Estado Pedidos
              </h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #eee', fontSize: 12 }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm text-center py-10">Sin pedidos aún</p>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {[  
            { id: 'orders', label: 'Pedidos', icon: <Package size={15} /> },
            { id: 'comments', label: 'Comentarios', icon: <MessageSquare size={15} /> },
            { id: 'inventory', label: 'Inventario', icon: <ToggleRight size={15} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 font-bold text-sm tracking-wider uppercase transition-colors ${
                activeTab === tab.id ? 'text-[#162444] border-b-2 border-[#162444]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Top Products Sidebar */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-[#162444] flex items-center gap-2 mb-5">
                  <ShoppingBag size={18} className="text-[#C5A880]" /> Top Productos
                </h3>
                {topProducts.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin datos aún</p>
                ) : (
                  <>
                    <ul className="space-y-3 mb-5">
                      {topProducts.map(([name, count], i) => (
                        <li key={name} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 truncate max-w-[140px]">
                            <span className="font-bold text-[#C5A880] mr-2">#{i + 1}</span>{name}
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 flex-shrink-0">{count}</span>
                        </li>
                      ))}
                    </ul>
                    {barData.length > 0 && (
                      <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                          <Tooltip contentStyle={{ fontSize: 11, borderRadius: '8px' }} />
                          <Bar dataKey="cantidad" fill="#162444" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </>
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
                      <OrderCard key={order.id} order={order} onConfirm={confirmOrder} onDelete={deleteOrder} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'comments' && (
          /* Comments Table */
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-[#162444]">Comentarios de Usuarios</h3>
              <span className="bg-[#162444] text-white text-xs font-bold px-3 py-1 rounded-full">{comments.length} total</span>
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
                          <span className="bg-amber-50 text-amber-600 font-bold px-2.5 py-1 rounded-full text-xs">
                            {'★'.repeat(comment.estrellas)} {comment.estrellas}/5
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 italic max-w-xs truncate">"{comment.texto}"</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
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

        {activeTab === 'inventory' && (
          /* Inventory Tab */
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-[#162444]">Control de Inventario</h3>
              <p className="text-sm text-gray-400 mt-1">Activa o desactiva productos. El menú público se actualiza al instante.</p>
            </div>
            {['desayunos', 'meriendas', 'bebidas'].map(cat => (
              <div key={cat} className="border-b border-gray-100 last:border-0">
                <h4 className="px-6 py-3 bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-500">{cat}</h4>
                <div className="divide-y divide-gray-50">
                  {menuData[cat].map(item => {
                    const inv = inventory[item.id];
                    const available = inv ? inv.available !== false : true;
                    return (
                      <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                        <div>
                          <p className={`font-medium text-sm ${available ? 'text-[#162444]' : 'text-gray-400 line-through'}`}>{item.nombre}</p>
                          <p className="text-xs text-gray-400">{item.precio}</p>
                        </div>
                        <button
                          onClick={() => toggleAvailability(item.id, available)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                            available
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {available
                            ? <><ToggleRight size={16} /> Disponible</>
                            : <><ToggleLeft size={16} /> Agotado</>
                          }
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Sub-componentes ────────────────────────────────────────────
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
