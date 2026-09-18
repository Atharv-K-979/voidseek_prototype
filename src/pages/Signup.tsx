import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Loader2, User, Building2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

type Role = 'Individual' | 'Enterprise Admin' | 'Forensic Auditor';

const ROLES: { value: Role; icon: typeof User; label: string; desc: string }[] = [
  { value: 'Individual', icon: User, label: 'Individual', desc: 'Personal device management & recovery' },
  { value: 'Enterprise Admin', icon: Building2, label: 'Enterprise Admin', desc: 'Organization-wide deployment & reporting' },
  { value: 'Forensic Auditor', icon: Search, label: 'Forensic Auditor', desc: 'Digital forensics & court-admissible certificates' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [role, setRole] = useState<Role>('Enterprise Admin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) { setError('Please fill in all required fields.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      navigate('/dashboard');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[#1E293B] text-lg">VoidSeek</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#1E293B] mb-1">Create your account</h1>
        <p className="text-slate-500 text-sm mb-8">Join VoidSeek — secure erasure, forensic recovery, and verified certificates.</p>

        {/* Role picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Your role</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ value, icon: Icon, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all
                  ${role === value
                    ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <div className="text-xs font-semibold">{label}</div>
                <div className="text-[10px] leading-tight opacity-70 hidden sm:block">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
                placeholder="Arjun Mehta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization</label>
              <input
                value={org}
                onChange={e => setOrg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
                placeholder="Acme Cyber Defense"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Work email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
              placeholder="you@organization.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all disabled:opacity-70"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1E3A8A] font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="mt-3 text-center text-xs text-slate-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
