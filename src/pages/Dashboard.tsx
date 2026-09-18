import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardDrive, Shield, RotateCcw, FileCheck, AlertTriangle,
  CheckCircle, Clock, Trash2, ChevronRight, Activity,
  TrendingUp, Database, Cpu, Wifi, Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Device } from '../mockData';

// ── Skeleton loader ───────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="p-4 border-b border-slate-100 flex items-start gap-3 animate-pulse">
      <div className="w-9 h-9 bg-slate-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 rounded-full w-2/3" />
        <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
        <div className="h-1.5 bg-slate-100 rounded-full w-full" />
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <div className="w-14 h-6 bg-slate-200 rounded-lg" />
        <div className="w-14 h-6 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm animate-pulse">
      <div className="w-8 h-8 bg-slate-200 rounded-lg mb-3" />
      <div className="h-7 bg-slate-200 rounded-full w-12 mb-1.5" />
      <div className="h-2.5 bg-slate-100 rounded-full w-20" />
    </div>
  );
}

// ── Device type icon ──────────────────────────────────────────────────
const DeviceTypeIcon = ({ type }: { type: Device['type'] }) => {
  const cls = "w-4 h-4";
  if (type === 'NVMe') return <Cpu className={cls} />;
  if (type === 'USB') return <Database className={cls} />;
  return <HardDrive className={cls} />;
};

const StatusBadge = ({ status }: { status: Device['status'] }) => {
  const map = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700',
    physical_damage: 'bg-red-100 text-red-800',
  };
  const labels = { healthy: 'Healthy', warning: 'Warning', critical: 'Critical', physical_damage: 'Damaged' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status]}`}>{labels[status]}</span>;
};

const HealthBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className={`h-full rounded-full ${value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
      />
    </div>
    <span className="text-xs text-slate-500 w-8 text-right font-mono">{value}%</span>
  </div>
);

// ── Live activity ticker ──────────────────────────────────────────────
const ACTIVITY = [
  { msg: 'Wipe certificate issued for CRUCIAL P3 PLUS 2TB', time: '2m ago', color: 'text-[#1E3A8A]' },
  { msg: 'Recovery scan completed on SEAGATE BARRACUDA 2TB', time: '14m ago', color: 'text-green-600' },
  { msg: 'HPA/DCO detected on KINGSTON DT 100G3', time: '1h ago', color: 'text-amber-600' },
  { msg: 'Physical damage flagged on TOSHIBA MQ04ABF100', time: '2d ago', color: 'text-red-600' },
  { msg: 'Erasure session authenticated — Arjun Mehta', time: '3d ago', color: 'text-slate-500' },
];

export default function Dashboard() {
  const { user, devices, certificates, addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [activityIdx, setActivityIdx] = useState(0);

  // Simulate initial data load
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      addNotification('Dashboard loaded — 6 devices online', 'info');
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Cycle activity
  useEffect(() => {
    const t = setInterval(() => setActivityIdx(i => (i + 1) % ACTIVITY.length), 4000);
    return () => clearInterval(t);
  }, []);

  const healthy = devices.filter(d => d.status === 'healthy').length;
  const warnings = devices.filter(d => d.status === 'warning').length;
  const damaged = devices.filter(d => d.status === 'physical_damage').length;
  const erased = devices.filter(d => d.erased).length;

  const SUMMARY = [
    { label: 'Total Devices', value: devices.length, icon: HardDrive, color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
    { label: 'Healthy', value: healthy, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Warnings', value: warnings, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Certificates', value: certificates.length, icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Devices Erased', value: erased, icon: Trash2, color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
    { label: 'Physical Damage', value: damaged, icon: Shield, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <Activity className="w-3 h-3" />
              LIVE DASHBOARD ·{' '}
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">
              {greeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {user?.role === 'Forensic Auditor' && 'Forensic audit workspace — all certificate operations are court-admissible.'}
              {user?.role === 'Enterprise Admin' && 'Enterprise dashboard — managing all organizational devices and compliance.'}
              {user?.role === 'Individual' && 'Your personal VoidSeek workspace — secure, verified, and audited.'}
            </p>
          </div>

          {/* Live activity ticker */}
          <div className="hidden lg:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 max-w-xs shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 pulse-ring flex-shrink-0" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activityIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex-1 min-w-0"
              >
                <div className="text-xs text-slate-600 truncate">{ACTIVITY[activityIdx].msg}</div>
                <div className="text-[10px] text-slate-400">{ACTIVITY[activityIdx].time}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {loading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          SUMMARY.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-default"
            >
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-extrabold text-[#1E293B]">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Device list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E293B] flex items-center gap-2">
              Connected Devices
              <span className="text-xs font-mono text-slate-400">({devices.length})</span>
            </h2>
            <Link to="/devices" className="text-xs text-[#1E3A8A] hover:underline font-semibold flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              Array(4).fill(0).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              devices.map((device, i) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.2 }}
                  className={`p-4 ${i < devices.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      device.status === 'physical_damage' ? 'bg-red-100' : 'bg-slate-100'
                    }`}>
                      <DeviceTypeIcon type={device.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-[#1E293B] truncate">{device.name}</span>
                        <StatusBadge status={device.status} />
                        {device.hasHPA && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">HPA</span>}
                        {device.hasDCO && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">DCO</span>}
                        {device.erased && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold">ERASED</span>}
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        {device.type} · {device.interface} · {device.capacity} · {device.platform}
                      </div>
                      <HealthBar value={device.health} />
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {device.status !== 'physical_damage' && !device.erased && (
                        <>
                          <Link
                            to={`/erase/${device.id}`}
                            className="text-xs px-3 py-1 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold"
                          >
                            Erase
                          </Link>
                          <Link
                            to={`/recover/${device.id}`}
                            className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium text-center"
                          >
                            Recover
                          </Link>
                        </>
                      )}
                      {device.status === 'physical_damage' && (
                        <Link
                          to={`/erase/${device.id}`}
                          className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                        >
                          Escalate
                        </Link>
                      )}
                      {device.erased && (
                        <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-center">✓ Done</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent certificates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1E293B]">Recent Certificates</h2>
              <Link to="/certificates" className="text-xs text-[#1E3A8A] hover:underline font-semibold flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse">
                    <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
                    <div className="h-2.5 bg-slate-100 rounded w-2/3 mb-1.5" />
                    <div className="h-2 bg-slate-100 rounded w-full" />
                  </div>
                ))
              ) : (
                certificates.slice(0, 4).map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.4 }}
                    whileHover={{ x: 2 }}
                  >
                    <Link
                      to="/certificates"
                      className="block bg-white rounded-xl border border-slate-200 shadow-sm p-3 hover:border-[#1E3A8A]/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          cert.type === 'wipe' ? 'bg-[#1E3A8A]' :
                          cert.type === 'recovery' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{cert.type}</span>
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          cert.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {cert.status}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-[#1E293B] truncate">{cert.deviceName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">
                        {cert.hash.slice(0, 20)}…
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(cert.timestamp).toLocaleDateString('en-IN')} ·{' '}
                        {new Date(cert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="font-bold text-[#1E293B] mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: '/devices', icon: HardDrive, label: 'Scan Devices', color: 'bg-[#1E3A8A]/10 text-[#1E3A8A]' },
                { to: '/certificates', icon: FileCheck, label: 'Audit Log', color: 'bg-purple-100 text-purple-600' },
                { to: '/reports', icon: TrendingUp, label: 'Reports', color: 'bg-green-100 text-green-600' },
                { to: '/settings', icon: Shield, label: 'Compliance', color: 'bg-amber-100 text-amber-600' },
              ].map(({ to, icon: Icon, label, color }, i) => (
                <motion.div key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={to}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#1E3A8A]/30 hover:shadow-sm transition-all text-center"
                  >
                    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="bg-[#1E293B] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-white font-bold text-sm">System Status</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Erasure Engine', status: 'Online', ok: true },
                { label: 'Recovery Engine', status: 'Online', ok: true },
                { label: 'Certificate Chain', status: 'Verified', ok: true },
                { label: 'Audit Logger', status: 'Active', ok: true },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-400 pulse-ring' : 'bg-red-400'}`} />
                    <span className={`text-xs font-mono font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
