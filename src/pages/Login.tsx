import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState('admin@voidseek.io');
  const [password, setPassword] = useState('••••••••');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      login(email, 'Enterprise Admin');
      navigate('/dashboard');
    }, 1600);
  };

  const handleSSO = () => {
    setSsoLoading(true);
    setTimeout(() => {
      login('sso@voidseek.io', 'Forensic Auditor');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1E293B] p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1E3A8A] rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl">VoidSeek</span>
        </div>

        <div>
          <div className="text-4xl font-extrabold text-white leading-tight mb-4">
            Secure erasure.<br />
            Forensic recovery.<br />
            <span className="text-[#16A34A]">Verified.</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            The unified platform for certified data sanitization and advanced file recovery — trusted by enterprise security teams and forensic auditors.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['NIST SP 800-88', 'IEEE 2883-2022', 'ISO/IEC 27040', 'DoD 5220.22-M'].map(b => (
            <div key={b} className="bg-white/5 rounded-lg px-3 py-2 text-slate-300 text-xs font-mono">{b}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[#1E293B] text-lg">VoidSeek</span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#1E293B] mb-1">Sign in</h1>
          <p className="text-slate-500 text-sm mb-8">Access your VoidSeek workspace</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
                placeholder="you@organization.com"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs text-[#1E3A8A] hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all disabled:opacity-70"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</> : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleSSO}
            disabled={ssoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:shadow-sm transition-all disabled:opacity-70"
          >
            {ssoLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting to SSO…</>
              : <><Building2 className="w-4 h-4" /> Sign in with Organization SSO</>
            }
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#1E3A8A] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
