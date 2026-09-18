import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  Shield, HardDrive, RotateCcw, FileCheck, Check, X,
  Link2, Lock, Zap, Award, Database, Globe,
  TrendingUp, Leaf, Users, ArrowRight, Star, ChevronRight,
  Cpu, Server
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Animated counter hook ─────────────────────────────────────────────
function useCounter(target: number, duration = 1.8, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ── Fade-in on scroll ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stat card with counter ────────────────────────────────────────────
function StatCard({ value, label, icon: Icon, prefix = '', suffix = '' }: {
  value: number; label: string; icon: typeof TrendingUp; prefix?: string; suffix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1.6, inView);
  return (
    <div ref={ref} className="text-center">
      <Icon className="w-6 h-6 text-[#16A34A] mx-auto mb-3" />
      <div className="text-3xl font-extrabold text-white mb-1 tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

const COMPETITORS = [
  { name: 'BitRaser', limitation: 'No integrated recovery-based verification', voidseek: 'Self-verifying, runs a forensic recovery pass after erasure' },
  { name: 'DBAN', limitation: 'No SSD/NVMe/certification support', voidseek: 'ATA Secure Erase, SSD/NVMe support, signed certification' },
  { name: 'Blancco', limitation: 'Certificates are single-record SHA-256, not chain-linked', voidseek: 'Chain-linked, tamper-evident Merkle certificates' },
  { name: 'WipeDrive', limitation: 'Certificates are PDF reports, not cryptographically signed', voidseek: 'Digitally signed certificates verifiable by third parties' },
];

const FEATURES = [
  { icon: Shield, title: 'Military-Grade Erasure', desc: 'ATA Secure Erase, NVMe Format, 7-pass DoD 5220.22-M — certified data destruction across all storage media.' },
  { icon: RotateCcw, title: 'Forensic File Recovery', desc: 'Deep file-carving, journal analysis, and signature-based recovery with per-file confidence scoring.' },
  { icon: Link2, title: 'Merkle-Hash Certificates', desc: 'Each operation anchored to a cryptographically linked chain — tamper-evident, verifiable by any third party.' },
  { icon: Lock, title: 'ECDSA-P256 Signing', desc: 'Every certificate digitally signed with elliptic-curve cryptography. Any modification is instantly detectable.' },
  { icon: Globe, title: 'Cross-Platform', desc: 'Windows, Linux, Android, and Bare-metal. NTFS, exFAT, ext4, APFS. HDD, SSD, NVMe, and USB.' },
  { icon: Zap, title: 'HPA & DCO Detection', desc: 'Automatically detects and restores hidden sectors before erasure — nothing is missed.' },
];

const BADGES = ['NIST SP 800-88 Rev.2', 'IEEE 2883-2022', 'IEEE 2883.1-2025', 'ISO/IEC 27040:2024', 'DoD 5220.22-M'];

const LOG_LINES = [
  { tag: '[INIT]', color: 'text-slate-400', msg: 'VoidSeek Erasure Engine v3.1.2 — session started' },
  { tag: '[INFO]', color: 'text-blue-400', msg: 'Target: SAMSUNG 970 EVO PLUS (NVMe, 500GB)' },
  { tag: '[DETECT]', color: 'text-amber-400', msg: 'HPA detected — restoring full LBA range' },
  { tag: '[OK]', color: 'text-green-400', msg: 'HPA cleared — native max address confirmed' },
  { tag: '[STEP 3]', color: 'text-blue-400', msg: 'ATA SECURITY ERASE UNIT (Enhanced mode)…' },
  { tag: '[WRITE]', color: 'text-slate-300', msg: 'Pass 3/3 — pseudorandom CSPRNG pattern' },
  { tag: '[VERIFY]', color: 'text-purple-400', msg: 'Forensic scan — 0 signatures found' },
  { tag: '[ENTROPY]', color: 'text-purple-400', msg: 'Sector entropy: 7.998 bits/byte ✓' },
  { tag: '[DONE]', color: 'text-green-400', msg: 'Erasure verified — no recoverable data' },
  { tag: '[CHAIN]', color: 'text-green-400', msg: 'Merkle block #007 anchored…' },
];

// Typing terminal
function AnimatedTerminal() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= LOG_LINES.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6 shadow-2xl shadow-slate-900/40">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-slate-400 text-xs font-mono">VoidSeek Erasure Engine v3.1.2</span>
      </div>
      <div className="font-mono text-xs space-y-1.5 min-h-[180px]">
        {LOG_LINES.slice(0, visible).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2"
          >
            <span className={`${line.color} w-20 flex-shrink-0`}>{line.tag}</span>
            <span className="text-slate-300">{line.msg}</span>
          </motion.div>
        ))}
        {visible < LOG_LINES.length && <div className="text-green-400 terminal-cursor" />}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Sectors wiped</span>
          <span>{visible >= LOG_LINES.length ? '100%' : `${Math.round((visible / LOG_LINES.length) * 100)}%`}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.round((visible / LOG_LINES.length) * 100)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleDemoLaunch = () => {
    login('admin@voidseek.io', 'Enterprise Admin');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-sm"
            >
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-[#1E293B] font-bold text-lg tracking-tight">VoidSeek</span>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-6">
            {['features', 'compare', 'compliance', 'impact'].map(s => (
              <a key={s} href={`#${s}`} className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors capitalize">{s}</a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] transition-all hover:shadow-md cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 0.6,
        }} />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#1E3A8A]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Platform badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E3A8A]/10 rounded-full text-[#1E3A8A] text-xs font-semibold mb-6 border border-[#1E3A8A]/20"
              >
                <Shield className="w-3 h-3 text-[#1E3A8A]" />
                NIST SP 800-88 &amp; IEEE 2883-2022 Certified Architecture
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1E293B] leading-[1.08] mb-6">
                Wipe.
                <br />
                Recover.
                <br />
                <motion.span
                  className="text-[#1E3A8A] inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Verify.
                </motion.span>
              </h1>

              <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-xl">
                The only unified platform combining{' '}
                <strong className="text-slate-700">certified data erasure</strong>,{' '}
                <strong className="text-slate-700">forensic file recovery</strong>, and{' '}
                <strong className="text-slate-700">tamper-evident Merkle-linked certificates</strong> —
                engineered for digital forensics and data sanitization at enterprise scale.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all hover:shadow-lg hover:shadow-blue-900/20 cursor-pointer"
                  >
                    Launch App <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#compare"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    See Comparison
                  </a>
                </motion.div>
              </div>

              {/* Compliance badges */}
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b, i) => (
                  <motion.span
                    key={b}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 font-mono font-medium shadow-sm"
                  >
                    {b}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <AnimatedTerminal />

              {/* Floating cert badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg border border-green-200 p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Certificate Verified</div>
                  <div className="text-[10px] text-slate-400 font-mono">Merkle Block #007 · NIST 800-88</div>
                </div>
              </motion.div>

              {/* Floating chain badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-[#1E3A8A]/20 p-3 flex items-center gap-2"
              >
                <Link2 className="w-4 h-4 text-[#1E3A8A]" />
                <div className="text-xs font-bold text-slate-800">Merkle Chain</div>
                <div className="w-2 h-2 rounded-full bg-green-500 pulse-ring" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Flow diagram ────────────────────────────────────────────── */}
      <section className="py-12 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">How it works</p>
          </Reveal>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { icon: Lock, label: 'Authenticate', sub: 'Org SSO or email' },
              { icon: HardDrive, label: 'Select Device', sub: 'HDD/SSD/NVMe/USB' },
              { icon: Server, label: 'Check Status', sub: 'Health, HPA, DCO' },
              { icon: Shield, label: 'Erase or Recover', sub: 'Your choice' },
              { icon: FileCheck, label: 'Get Certificate', sub: 'Merkle-linked' },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <Reveal delay={i * 0.08} className="flex-shrink-0">
                  <div className="flex flex-col items-center gap-2 text-center w-28">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div className="text-xs font-bold text-slate-700">{step.label}</div>
                    <div className="text-[10px] text-slate-400">{step.sub}</div>
                  </div>
                </Reveal>
                {i < 4 && (
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#1E293B]" id="impact">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard value={50000} label="Crore in unused IT assets unlocked" icon={TrendingUp} prefix="₹" suffix="+ Cr" />
            <StatCard value={25000} label="Jobs supported in IT asset management" icon={Users} suffix="+" />
            <StatCard value={40} label="Reduction in e-waste per device lifecycle" icon={Leaf} suffix="%" />
            <StatCard value={99.97} label="Erasure verification accuracy" icon={Award} suffix="%" />
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A] mb-3">Proposed Solution</div>
            <h2 className="text-3xl font-extrabold text-[#1E293B] mb-4">One platform. Three critical capabilities.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Fragmented tools create security gaps. VoidSeek unifies secure erasure, forensic recovery, and certified audit trails under one cryptographically verifiable system.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(30,58,138,0.10)' }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#1E3A8A]/30 transition-colors cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <h3 className="font-bold text-[#1E293B] mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Merkle Chain visual ──────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-[#1E3A8A]/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A] mb-3">Competitive Advantage</div>
              <h2 className="text-3xl font-extrabold text-[#1E293B] mb-4">Merkle-linked certificate chains</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Unlike competitors who issue isolated PDF reports or single-record SHA-256 hashes,
                every VoidSeek certificate is cryptographically chained to the previous one —
                creating an immutable audit trail that cannot be backdated, forged, or selectively modified.
              </p>
              {['Tamper-evident: modifying any certificate breaks the chain', 'Third-party verifiable: no trust required in VoidSeek itself', 'Blockchain-ready: compatible with permissioned ledger anchoring'].map((p, i) => (
                <Reveal key={p} delay={i * 0.1}>
                  <div className="flex items-start gap-2 text-sm text-slate-600 mb-2">
                    <Check className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" strokeWidth={3} />
                    {p}
                  </div>
                </Reveal>
              ))}
            </Reveal>

            <div className="flex flex-col gap-3">
              {[
                { idx: '005', hash: 'a3f7b2c1d9e4…', prev: 'd9e4a8f27c1b…', type: 'Wipe', device: 'SAMSUNG 970 EVO PLUS' },
                { idx: '006', hash: 'd9e4a8f27c1b…', prev: '7c1b5a3ef2a9…', type: 'Recovery', device: 'WD BLUE SSD 1TB' },
                { idx: '007', hash: '7c1b5a3ef2a9…', prev: 'a3f7b2c1d9e4…', type: 'Wipe', device: 'CRUCIAL P3 PLUS 2TB', active: true },
              ].map((block, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className={`bg-white rounded-xl border ${block.active ? 'border-l-4 border-[#16A34A]' : 'border-l-4 border-[#1E3A8A]/40'} border border-slate-200 p-4 shadow-sm`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">BLOCK #{block.idx}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${block.type === 'Wipe' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]' : 'bg-green-100 text-green-700'}`}>{block.type}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 mb-2">{block.device}</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div><span className="text-slate-400">hash: </span><span className="text-slate-600">{block.hash}</span></div>
                      <div><span className="text-slate-400">prev: </span><span className="text-slate-600">{block.prev}</span></div>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="flex items-center justify-center my-1">
                      <motion.div
                        animate={{ scaleY: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                        className="w-0.5 h-4 bg-[#1E3A8A]/30 rounded-full"
                      />
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────── */}
      <section className="py-20 px-6" id="compare">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A] mb-3">Competitive Analysis</div>
            <h2 className="text-3xl font-extrabold text-[#1E293B] mb-3">Why VoidSeek wins</h2>
            <p className="text-slate-500">Where existing tools fall short — and what VoidSeek does differently.</p>
          </Reveal>

          <Reveal>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                <div className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Competitor</div>
                <div className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Limitation</div>
                <div className="p-4 text-xs font-semibold text-[#16A34A] uppercase tracking-wide">VoidSeek Advantage</div>
              </div>
              {COMPETITORS.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`grid grid-cols-3 ${i < COMPETITORS.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors`}
                >
                  <div className="p-4">
                    <span className="font-bold text-slate-700">{c.name}</span>
                  </div>
                  <div className="p-4 flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-500">{c.limitation}</span>
                  </div>
                  <div className="p-4 flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" strokeWidth={3} />
                    <span className="text-sm text-slate-600 font-medium">{c.voidseek}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Compliance ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#1E293B]" id="compliance">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#16A34A] mb-3">Compliance</div>
            <h2 className="text-2xl font-extrabold text-white mb-8">Built to meet the strictest global standards</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { badge: 'NIST SP 800-88 Rev.2', desc: 'Media Sanitization Guidelines' },
              { badge: 'IEEE 2883-2022', desc: 'Standard for Sanitizing Storage' },
              { badge: 'IEEE 2883.1-2025', desc: 'Sanitization Procedures' },
              { badge: 'ISO/IEC 27040:2024', desc: 'Storage Security' },
              { badge: 'DoD 5220.22-M', desc: 'National Industrial Security Program' },
            ].map(({ badge, desc }, i) => (
              <Reveal key={badge} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center cursor-default transition-colors"
                >
                  <div className="text-white font-bold text-sm font-mono mb-1">{badge}</div>
                  <div className="text-slate-400 text-xs">{desc}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl font-extrabold text-[#1E293B] mb-4">Ready to secure your data lifecycle?</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Start with a free account. Full simulation with realistic data, live erasure logs,
              and cryptographically signed Merkle certificate generation — click-through ready for a live demo.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#1E3A8A] text-white font-bold rounded-2xl hover:bg-[#1d4ed8] transition-all hover:shadow-xl hover:shadow-blue-900/20 text-lg cursor-pointer"
              >
                Launch VoidSeek <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm font-bold text-slate-700">VoidSeek</span>
            <span className="text-slate-400 text-sm">· Military-Grade Sanitization &amp; Verification</span>
          </div>
          <div className="text-xs text-slate-400">Cryptographically Audited Storage Security Platform</div>
        </div>
      </footer>

      {/* Launch App Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-7 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center mb-4 text-[#1E3A8A]">
                <Shield className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-extrabold text-slate-800 mb-1">Launch VoidSeek</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Choose an option to enter the storage sanitization and forensic recovery suite:
              </p>

              <div className="space-y-4 mb-6">
                {/* Option 1: Login (RECOMMENDED) */}
                <div className="p-4 rounded-2xl border-2 border-[#1E3A8A] bg-[#1E3A8A]/5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-base">Sign In / Login</span>
                      <strong className="px-2.5 py-0.5 rounded-full bg-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-wider">
                        Recommended
                      </strong>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs mb-3.5 leading-relaxed">
                    Access the preloaded forensic demo environment with <strong>Admin (Enterprise Admin)</strong> credentials.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleDemoLaunch}
                      className="flex-1 px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" /> Instant Launch (Admin)
                    </button>
                    <Link
                      to="/login"
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 text-xs transition-colors text-center cursor-pointer"
                    >
                      Log In →
                    </Link>
                  </div>
                </div>

                {/* Option 2: Sign Up */}
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                  <div className="font-bold text-slate-800 text-base mb-1">Sign Up</div>
                  <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                    Register a new custom enterprise tenant, organization, or auditor profile.
                  </p>
                  <Link
                    to="/signup"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Create New Account →
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Cancel and return to overview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
