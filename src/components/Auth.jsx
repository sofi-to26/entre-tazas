import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../db/firebaseConfig';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@entretazas.com';

const Auth = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError('No tienes permisos de administrador.');
        return;
      }
      onAuth(cred.user);
    } catch (err) {
      const msgs = {
        'auth/invalid-credential': 'Email o contraseña incorrectos.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
        'auth/user-not-found': 'Usuario no encontrado.',
        'auth/wrong-password': 'Contraseña incorrecta.'
      };
      setError(msgs[err.code] || 'Error al iniciar sesión.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#162444] to-[#0a1225] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#162444] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#C5A880]" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-[#162444]">Panel Admin</h2>
          <p className="text-gray-400 text-sm mt-1">Entre Tazas - Acceso restringido</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-colors"
                placeholder="admin@entretazas.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-colors"
                placeholder="********"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#162444] hover:bg-[#C5A880] hover:text-[#162444] text-white font-bold rounded-lg uppercase tracking-wider transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const logout = () => signOut(auth);

export default Auth;
