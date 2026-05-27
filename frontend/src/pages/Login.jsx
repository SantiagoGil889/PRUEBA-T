import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [mode, setMode]           = useState('login');
  const [form, setForm]           = useState({ username: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]     = useState(false);
  const { login, register }       = useAuth();
  const navigate                  = useNavigate();

  const validate = () => {
    const errs = {};
    if (mode === 'register') {
      if (!form.username.trim())          errs.username = 'El nombre de usuario es requerido';
      else if (form.username.length < 3)  errs.username = 'Mínimo 3 caracteres';
      else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
                                          errs.username = 'Solo letras, números y _';
    }
    if (!EMAIL_RE.test(form.email))       errs.email    = 'Email inválido';
    if (!form.password)                   errs.password = 'La contraseña es requerida';
    else if (form.password.length < 6)    errs.password = 'Mínimo 6 caracteres';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setServerError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Error al conectar con el servidor';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setFieldErrors({});
    setServerError('');
    setForm({ username: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-[#A3151A]">Gestor de tareas</h1>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === m
                  ? 'bg-white shadow text-[#A3151A]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span>✕</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Username (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Usuario"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                  fieldErrors.username ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@email.com"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A3151A] hover:bg-[#700A0E] disabled:bg-[#ccc] text-white font-semibold py-2.5 rounded-xl transition-colors mt-2"
          >
            {loading
              ? 'Procesando...'
              : mode === 'login'
              ? 'Iniciar sesión'
              : 'Crear cuenta'}
          </button>
        </form>

        
      </div>
    </div>
  );
}
