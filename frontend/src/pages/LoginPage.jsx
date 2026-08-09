import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gold-500 mb-4">
            <span className="text-3xl">🛕</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Smart <span className="text-gold-500">Hundi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated Temple Collection Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-50 rounded-2xl p-7 border border-surface-border shadow-card">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-surface-border">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <h2 className="font-semibold text-sm text-white font-display">Admin Sign In</h2>
          </div>

          {error && (
            <div className="p-3 rounded-xl mb-4 bg-red-500/10 text-red-300 text-xs font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Demo Hint */}
            <div className="p-3 rounded-xl bg-gold-500/5 border border-gold-500/15 text-[11px] text-slate-400 space-y-0.5">
              <p className="font-medium text-gold-400 text-[10px] uppercase tracking-wider mb-1">Demo Credentials</p>
              <p className="font-mono">Username: <strong className="text-slate-200">admin</strong></p>
              <p className="font-mono">Password: <strong className="text-slate-200">adminpassword123</strong></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-6">
          Smart Hundi System © 2026 • Prototype
        </p>
      </div>
    </div>
  );
};
