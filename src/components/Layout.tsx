import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, HardDrive, Trash2, RotateCcw, FileCheck, BarChart3,
  Settings, Bell, ChevronDown, LogOut, Menu, X, Cpu, Wifi,
  CheckCircle, AlertTriangle, Info, XCircle, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { to: '/dashboard', icon: Activity, label: 'Dashboard' },
  { to: '/devices', icon: HardDrive, label: 'Devices' },
  { to: '/erase', icon: Trash2, label: 'Erase' },
  { to: '/recover', icon: RotateCcw, label: 'Recover' },
  { to: '/certificates', icon: FileCheck, label: 'Certificates & Audit' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, notifications, dismissNotification, devices } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const safeDevices = devices || [];
  const safeNotifications = notifications || [];
  const connectedCount = safeDevices.filter(d => d.status !== 'physical_damage').length;

  const Sidebar = (
    <aside className="w-64 bg-[#1E293B] flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-md">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wide">VoidSeek</div>
            <div className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">v3.1.2 · Secure</div>
          </div>
        </div>
        <button className="lg:hidden ml-auto text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-3 mb-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Navigation</p>
        </div>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className="relative flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#1E3A8A] rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Secure session indicator */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-ring" />
          <span className="text-[10px] font-mono text-slate-400">Session encrypted · TLS 1.3</span>
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="text-slate-400 text-[10px] truncate">{user?.role}</div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        {Sidebar}
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {Sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Connected devices */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-ring" />
            <span className="text-green-700 text-xs font-semibold">{connectedCount} Devices Connected</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-400 font-mono">
            <Wifi className="w-3.5 h-3.5 text-green-500" />
            <span className="hidden sm:inline">Secure Session Active</span>
          </div>

          {/* Bell */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <Bell className="w-4 h-4" />
            {safeNotifications.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"
              />
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold">
                {user?.avatar}
              </div>
              <span className="text-slate-700 text-sm font-semibold hidden sm:block">{user?.name}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{user?.email}</div>
                    <div className="text-[10px] font-mono text-[#1E3A8A] mt-1 bg-[#1E3A8A]/10 px-2 py-0.5 rounded-full inline-block">{user?.role}</div>
                  </div>
                  <Link
                    to="/settings"
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {safeNotifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              className={`
                pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm
                ${n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
                ${n.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : ''}
                ${n.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : ''}
                ${n.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
              `}
            >
              {n.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />}
              {n.type === 'error' && <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />}
              {n.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />}
              {n.type === 'info' && <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />}
              <span className="flex-1">{n.message}</span>
              <button onClick={() => dismissNotification(n.id)} className="text-current opacity-40 hover:opacity-80 transition-opacity ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
