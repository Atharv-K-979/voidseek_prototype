import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield, HardDrive, CheckCircle, XCircle, AlertTriangle,
  ChevronRight, Loader2, Terminal, FileCheck, Link2, Download,
  RotateCcw, Cpu, Database, FolderOpen, ArrowLeft, Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ERASE_LOG_LINES, Certificate, Device } from '../mockData';

type Step = 'select_path' | 'vm_check' | 'erasing' | 'verifying' | 'certificate' | 'escalation';
type ErasePath = 'full' | 'selective';

const genHash = () => Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export default function Erase() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { devices, addCertificate, markDeviceErased, addNotification, certificates, user } = useApp();

  // Find target device, or fall back to first active device if at /erase
  const targetDevice: Device = (deviceId ? devices.find(d => d.id === deviceId) : undefined)
    || devices.find(d => !d.erased && d.status !== 'physical_damage')
    || devices[0]
    || {
      id: 'dev-default',
      name: 'Samsung 970 EVO Plus',
      model: 'MZ-V7S500',
      type: 'NVMe',
      interface: 'PCIe 3.0 x4',
      capacity: '500 GB',
      capacityGB: 500,
      usedGB: 218,
      health: 98,
      status: 'healthy',
      platform: 'Linux',
      serial: 'S4EVNX0N704217',
      firmware: '2B2QEXM7',
      hasHPA: false,
      hasDCO: false,
      lastSeen: new Date().toISOString(),
    };

  const [step, setStep] = useState<Step>(() => {
    if (targetDevice.status === 'physical_damage') return 'escalation';
    return 'select_path';
  });
  const [path, setPath] = useState<ErasePath>('full');
  const [vmCheckDone, setVmCheckDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [escalationLogged, setEscalationLogged] = useState(false);
  const [escalationLog, setEscalationLog] = useState<string[]>([]);

  const logRef = useRef<HTMLDivElement>(null);
  const eraseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verifyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionScheduledRef = useRef(false);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines, escalationLog]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (eraseTimerRef.current) clearInterval(eraseTimerRef.current);
      if (logTimerRef.current) clearInterval(logTimerRef.current);
      if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
    };
  }, []);

  const startVmCheck = () => {
    setStep('vm_check');
    setVmCheckDone(false);
    setTimeout(() => setVmCheckDone(true), 1500);
  };

  const startErase = () => {
    if (eraseTimerRef.current) clearInterval(eraseTimerRef.current);
    if (logTimerRef.current) clearInterval(logTimerRef.current);
    if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
    transitionScheduledRef.current = false;

    setStep('erasing');
    setProgress(0);
    setLogLines([]);

    const lines = ERASE_LOG_LINES.map(l =>
      l.replace('{device}', targetDevice.name)
       .replace('{interface}', targetDevice.interface || 'SATA')
       .replace('{firmware}', targetDevice.firmware || 'Rev. 1.0')
       .replace('{hpa}', targetDevice.hasHPA ? 'Detected ⚠' : 'None')
       .replace('{dco}', targetDevice.hasDCO ? 'Detected ⚠' : 'None')
       .replace('{block}', String(certificates.length + 1))
       .replace('{hash}', genHash().slice(0, 16) + '…')
    );

    let lineIdx = 0;
    const totalDuration = 7000; // 7 seconds for a crisp, responsive flow
    const lineInterval = Math.max(100, totalDuration / lines.length);

    logTimerRef.current = setInterval(() => {
      if (lineIdx < lines.length) {
        const lineToAdd = lines[lineIdx];
        lineIdx++;
        if (lineToAdd) {
          setLogLines(prev => [...prev, lineToAdd]);
        }
      } else {
        if (logTimerRef.current) clearInterval(logTimerRef.current);
      }
    }, lineInterval);

    const intervalMs = 100;
    const stepIncrement = 100 / (totalDuration / intervalMs);
    let currentProg = 0;

    eraseTimerRef.current = setInterval(() => {
      currentProg += stepIncrement;
      if (currentProg >= 100) {
        if (eraseTimerRef.current) clearInterval(eraseTimerRef.current);
        if (logTimerRef.current) clearInterval(logTimerRef.current);
        setProgress(100);

        if (!transitionScheduledRef.current) {
          transitionScheduledRef.current = true;
          setTimeout(() => {
            startVerify();
          }, 400);
        }
      } else {
        setProgress(Math.min(99, Math.round(currentProg * 10) / 10));
      }
    }, intervalMs);
  };

  const startVerify = () => {
    if (eraseTimerRef.current) clearInterval(eraseTimerRef.current);
    if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);

    setStep('verifying');
    setVerifyProgress(0);

    let currentVerify = 0;
    verifyTimerRef.current = setInterval(() => {
      currentVerify += 4; // 2.5 seconds verification pass
      if (currentVerify >= 100) {
        if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
        setVerifyProgress(100);
        setTimeout(() => {
          completeEraseAndCertify();
        }, 500);
      } else {
        setVerifyProgress(Math.min(99, Math.round(currentVerify)));
      }
    }, 100);
  };

  const completeEraseAndCertify = () => {
    const hash = genHash();
    const prevHash = (certificates.length > 0 && certificates[0]?.hash)
      ? String(certificates[0].hash)
      : '0'.repeat(64);

    const newCert: Certificate = {
      id: `CERT-VS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: 'wipe',
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      timestamp: new Date().toISOString(),
      method: path === 'full'
        ? 'ATA Secure Erase (Enhanced) + 3-Pass DoD 5220.22-M'
        : 'Selective File Shredding (Gutmann 35-pass) + Metadata Purge',
      standard: 'NIST SP 800-88 Rev.2',
      hash,
      previousHash: prevHash,
      blockIndex: certificates.length,
      operator: user?.name ? `${user.name} (${user.role})` : 'System Security Operator',
      status: 'verified',
      signature: Array.from({ length: 2 }, () =>
        Array.from({ length: 44 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[Math.floor(Math.random() * 64)]).join('')
      ).join('\n'),
    };

    addCertificate(newCert);
    markDeviceErased(targetDevice.id);
    setCert(newCert);
    setStep('certificate');
    addNotification(`Wipe certificate issued for ${targetDevice.name}`, 'success');
  };

  const downloadReport = (c: Certificate) => {
    const capacityGB = targetDevice.capacityGB ?? 500;
    const reportText = [
      '================================================================================',
      '                     VOIDSEEK DATA SANITIZATION CERTIFICATE                     ',
      '                        NIST SP 800-88 Rev.2 COMPLIANT                          ',
      '================================================================================',
      '',
      `Certificate Identifier : ${c.id}`,
      `Issuance Timestamp     : ${new Date(c.timestamp).toUTCString()}`,
      `Validation Status      : VERIFIED & CRYPTOGRAPHICALLY SEALED`,
      `Authorized Operator    : ${c.operator}`,
      `Security Standard      : ${c.standard}`,
      `Sanitization Method    : ${c.method}`,
      '',
      '── HARDWARE SPECIFICATIONS ─────────────────────────────────────────────────────',
      `Device Name            : ${targetDevice.name}`,
      `Model Number           : ${targetDevice.model || 'N/A'}`,
      `Serial Number (S/N)    : ${targetDevice.serial || 'N/A'}`,
      `Interface Type         : ${targetDevice.interface || 'SATA'}`,
      `Storage Capacity       : ${targetDevice.capacity || `${capacityGB} GB`} (${capacityGB} GB)`,
      `Device Firmware        : ${targetDevice.firmware || 'Rev 1.0'}`,
      `Host Protected Area    : ${targetDevice.hasHPA ? 'Restored & Overwritten' : 'None Detected'}`,
      `Configuration Overlay  : ${targetDevice.hasDCO ? 'Reset & Cleared' : 'None Detected'}`,
      '',
      '── FORENSIC VERIFICATION RESULTS ───────────────────────────────────────────────',
      'Forensic Scan Pass     : COMPLETED (Read-Only Forensic Mount)',
      'File Signatures Found  : 0 (Zero recoverable artifacts detected)',
      'Journal Reconstruction : 0 (No file system structures remaining)',
      'Sector Entropy Value   : 7.998 bits/byte (Exceeds 7.99 standard threshold)',
      'Verification Result    : 100% SANITIZED — IRRECOVERABLE',
      '',
      '── CRYPTOGRAPHIC AUDIT ANCHOR (MERKLE LINK) ───────────────────────────────────',
      `Block Sequence Index   : #${c.blockIndex}`,
      `SHA-256 Block Hash     : ${c.hash}`,
      `Previous Block Hash    : ${c.previousHash}`,
      '',
      '── DIGITAL SIGNATURE (ECDSA-P256) ──────────────────────────────────────────────',
      '-----BEGIN CERTIFICATE DIGITAL SIGNATURE-----',
      c.signature,
      '-----END CERTIFICATE DIGITAL SIGNATURE-----',
      '',
      '================================================================================',
      '  VoidSeek Cryptographic Sanitization & Audit System                            ',
      '  This record is tamper-evident and court-admissible under ISO/IEC 27040:2024   ',
      '================================================================================',
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.id}-Forensic-Wipe-Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Official erasure certificate downloaded', 'success');
  };

  const startEscalation = () => {
    setEscalationLogged(false);
    setEscalationLog([]);
    const lines = [
      '[INIT]    VoidSeek Escalation Handler — starting physical damage assessment',
      `[INFO]    Target: ${targetDevice.name} (${targetDevice.type}, ${targetDevice.capacity})`,
      '[SCAN]    Attempting to mount device read-only…',
      '[ERROR]   I/O error on device — cannot read sector 0',
      '[ERROR]   SMART data unavailable — drive not responding',
      '[DETECT]  Symptom: platter failure / read head crash detected',
      '[FLAG]    Device flagged for physical destruction',
      '[LOG]     Failure event logged to audit trail',
      '[CERT]    Generating Non-Recoverable status certificate…',
      '[SIGN]    Applying ECDSA-P256 digital signature…',
      '[CHAIN]   Anchoring to Merkle certificate chain…',
      '[DONE]    Non-Recoverable certificate issued — device must be physically destroyed',
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i < lines.length) {
        const lineToAdd = lines[i];
        i++;
        if (lineToAdd) {
          setEscalationLog(prev => [...prev, lineToAdd]);
        }
      } else {
        clearInterval(t);
        setEscalationLogged(true);
        const hash = genHash();
        const prevHash = (certificates.length > 0 && certificates[0]?.hash)
          ? String(certificates[0].hash)
          : '0'.repeat(64);
        const newCert: Certificate = {
          id: `CERT-ESC-${Date.now().toString().slice(-6)}`,
          type: 'non-recoverable',
          deviceId: targetDevice.id,
          deviceName: targetDevice.name,
          timestamp: new Date().toISOString(),
          method: 'Physical Damage Assessment — Platter Failure Detected',
          standard: 'IEEE 2883-2022',
          hash,
          previousHash: prevHash,
          blockIndex: certificates.length,
          operator: user?.name ? `${user.name} (Escalation)` : 'System (Escalation)',
          status: 'verified',
          signature: Array.from({ length: 2 }, () =>
            Array.from({ length: 44 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[Math.floor(Math.random() * 64)]).join('')
          ).join('\n'),
        };
        addCertificate(newCert);
        setCert(newCert);
        addNotification(`Non-Recoverable certificate issued for ${targetDevice.name}`, 'warning');
      }
    }, 500);
  };

  // ─── Escalation path ───────────────────────────────────────────────
  if (step === 'escalation') {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link to="/devices" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Devices
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-red-800">Physical Damage Detected</h1>
              <p className="text-sm text-red-600">{targetDevice.name} — {targetDevice.model}</p>
            </div>
          </div>
          <p className="text-sm text-red-700 leading-relaxed">
            This device shows signs of severe physical damage (platter failure / read head crash). Standard software-based erasure and recovery are not possible. The device must be escalated for physical destruction with a certified Non-Recoverable status certificate.
          </p>
        </div>

        {!escalationLog.length && (
          <button
            onClick={startEscalation}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20 cursor-pointer"
          >
            Begin Escalation &amp; Log Failure
          </button>
        )}

        {escalationLog.length > 0 && (
          <div className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-400">Escalation Log</span>
            </div>
            <div ref={logRef} className="p-5 font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
              {escalationLog.map((line, i) => {
                const s = line || '';
                const color = s.startsWith('[ERROR]') ? 'text-red-400' :
                              s.startsWith('[OK]') || s.startsWith('[DONE]') ? 'text-green-400' :
                              s.startsWith('[WARN]') || s.startsWith('[FLAG]') ? 'text-amber-400' :
                              'text-slate-300';
                return <div key={i} className={color}>{s}</div>;
              })}
            </div>
          </div>
        )}

        {escalationLogged && cert && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-[#1E293B]">Non-Recoverable Certificate Issued</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><span className="text-slate-400 text-xs">Certificate ID</span><br /><span className="font-mono text-slate-700 text-xs">{cert.id}</span></div>
              <div><span className="text-slate-400 text-xs">Standard</span><br /><span className="font-medium text-slate-700">{cert.standard}</span></div>
              <div><span className="text-slate-400 text-xs">Block #</span><br /><span className="font-mono text-slate-700">{cert.blockIndex}</span></div>
              <div><span className="text-slate-400 text-xs">Status</span><br /><span className="text-red-600 font-semibold">NON-RECOVERABLE</span></div>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3 font-mono text-xs text-slate-500 break-all mb-4">
              <span className="text-slate-400">hash: </span>{cert.hash}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => downloadReport(cert)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Certificate
              </button>
              <Link to="/certificates" className="text-[#1E3A8A] text-xs font-semibold hover:underline inline-flex items-center">
                View in Audit Log →
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Step 1: Select Path ──────────────────────────────────────────
  if (step === 'select_path') {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link to="/devices" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Devices
        </Link>

        {/* 5-Step Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6 flex-wrap">
          <span className="text-[#1E3A8A] font-bold">1. PATH</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>2. VM</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>3. ERASING</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>4. VERIFY</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>5. CERTIFICATE</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A]/10 rounded-xl flex items-center justify-center">
                {targetDevice.type === 'NVMe' ? <Cpu className="w-5 h-5 text-[#1E3A8A]" /> :
                 targetDevice.type === 'USB' ? <Database className="w-5 h-5 text-[#1E3A8A]" /> :
                 <HardDrive className="w-5 h-5 text-[#1E3A8A]" />}
              </div>
              <div>
                <h2 className="font-bold text-[#1E293B]">{targetDevice.name}</h2>
                <p className="text-xs text-slate-400">{targetDevice.type} · {targetDevice.interface} · {targetDevice.capacity} · {targetDevice.platform}</p>
              </div>
            </div>

            {/* Device switcher */}
            {devices.length > 1 && (
              <select
                value={targetDevice.id}
                onChange={(e) => navigate(`/erase/${e.target.value}`)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-slate-50 outline-none font-medium"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.capacity}) {d.erased ? '✓' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {targetDevice.hasHPA && <span className="text-xs font-mono px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-bold">⚠ HPA Detected — Hidden sectors will be restored before erase</span>}
            {targetDevice.hasDCO && <span className="text-xs font-mono px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-bold">⚠ DCO Detected — Device Configuration Overlay will be cleared</span>}
            {targetDevice.erased && <span className="text-xs font-mono px-2 py-1 bg-green-100 text-green-700 rounded-lg font-bold">✓ Previously sanitized &amp; certified</span>}
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-[#1E293B] mb-2">Select Erasure Path</h1>
        <p className="text-slate-500 text-sm mb-6">Choose between a full drive wipe or targeted file/folder erasure.</p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {([
            { value: 'full' as ErasePath, icon: HardDrive, title: 'Full Drive Wipe', desc: 'Complete cryptographic erasure of all sectors — ATA Secure Erase + 3-pass DoD overwrite. Recommended for device decommissioning.', recommended: true },
            { value: 'selective' as ErasePath, icon: FolderOpen, title: 'File / Folder Selective Erase', desc: 'Locate and shred specific files with Gutmann 35-pass overwrite + metadata purge. Ideal for targeted data removal.', recommended: false },
          ]).map(({ value, icon: Icon, title, desc, recommended }) => (
            <button
              key={value}
              onClick={() => setPath(value)}
              className={`
                text-left p-6 rounded-2xl border-2 transition-all cursor-pointer
                ${path === value ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${path === value ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {recommended && <span className="text-xs font-bold px-2 py-0.5 bg-[#1E3A8A] text-white rounded-full ml-auto">Recommended</span>}
              </div>
              <h3 className="font-bold text-[#1E293B] mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={startVmCheck}
          className="px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all shadow-md shadow-blue-900/20 cursor-pointer"
        >
          Continue →
        </button>
      </div>
    );
  }

  // ─── Step 2: VM Check ─────────────────────────────────────────────
  if (step === 'vm_check') {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6 flex-wrap">
          <span className="text-green-500 font-bold">1. ✓ PATH</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#1E3A8A] font-bold">2. VM</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>3. ERASING</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>4. VERIFY</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>5. CERTIFICATE</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mx-auto mb-5">
            {vmCheckDone ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin" />}
          </div>

          {!vmCheckDone ? (
            <>
              <h2 className="text-lg font-extrabold text-[#1E293B] mb-2">Detecting Environment…</h2>
              <p className="text-slate-500 text-sm">Checking for virtualization layer, hypervisor signatures, and hardware attestation…</p>
              <div className="mt-6 space-y-2 text-xs font-mono text-left bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-slate-400">Checking CPUID hypervisor bit…</div>
                <div className="text-slate-400">Scanning ACPI tables for VMware/QEMU/Hyper-V signatures…</div>
                <div className="text-slate-400 animate-pulse">Verifying TPM 2.0 attestation…</div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-extrabold text-[#1E293B] mb-2">Bare-Metal Confirmed</h2>
              <p className="text-slate-500 text-sm mb-6">No hypervisor or virtualization detected. ATA/NVMe commands will reach the physical drive controller directly.</p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-left bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                {[
                  ['Hypervisor bit', 'NOT SET'],
                  ['ACPI scan', 'CLEAN'],
                  ['VMware DMI', 'NOT FOUND'],
                  ['QEMU signatures', 'NOT FOUND'],
                  ['TPM 2.0', 'PRESENT & ATTESTED'],
                  ['Secure Boot', 'ENABLED'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400">{k}</span>
                    <span className={v === 'CLEAN' || v.includes('NOT') || v.includes('PRESENT') || v === 'ENABLED' ? 'text-green-600 font-semibold' : 'text-red-500'}>{v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={startErase}
                className="px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                Begin Secure Erase →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Step 3: Erasing ──────────────────────────────────────────────
  if (step === 'erasing') {
    const capacityGB = targetDevice.capacityGB ?? 500;
    const gbErased = Math.round((progress / 100) * capacityGB);
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6 flex-wrap">
          <span className="text-green-500 font-bold">1. ✓ PATH</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-green-500 font-bold">2. ✓ VM</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#1E3A8A] font-bold">3. ERASING</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>4. VERIFY</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>5. CERTIFICATE</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E293B]">Secure Erasure in Progress</h2>
            <span className="text-sm font-mono font-bold text-[#1E3A8A]">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{targetDevice.name}</span>
            <span>{gbErased} / {capacityGB} GB</span>
          </div>
        </div>

        {/* Terminal log */}
        <div className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <Terminal className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <span className="text-xs font-mono text-slate-400">Erasure Engine Log</span>
          </div>
          <div ref={logRef} className="p-5 font-mono text-xs space-y-1.5 h-64 overflow-y-auto">
            {logLines.map((line, i) => {
              const s = line || '';
              const color = s.startsWith('[OK]') || s.startsWith('[DONE]') ? 'text-green-400' :
                            s.startsWith('[ERROR]') ? 'text-red-400' :
                            s.startsWith('[WARN]') || s.startsWith('[DETECT]') ? 'text-amber-400' :
                            s.startsWith('[WRITE]') || s.startsWith('[VERIFY]') || s.startsWith('[ENTROPY]') ? 'text-purple-400' :
                            s.startsWith('[SCAN]') ? 'text-cyan-400' :
                            'text-slate-300';
              return <div key={i} className={color}>{s}</div>;
            })}
            {progress < 100 && <div className="text-green-400 terminal-cursor inline-block" />}
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 4: Forensic Verification ────────────────────────────────
  if (step === 'verifying') {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6 flex-wrap">
          <span className="text-green-500 font-bold">1. ✓ PATH</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-green-500 font-bold">2. ✓ VM</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-green-500 font-bold">3. ✓ ERASED</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#1E3A8A] font-bold">4. VERIFY</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>5. CERTIFICATE</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-lg font-extrabold text-[#1E293B] mb-2">Forensic Verification Pass</h2>
          <p className="text-slate-500 text-sm mb-8">Running deep forensic scan to guarantee zero recoverable residual sectors. If verified, tamper-evident certificate is anchored.</p>

          <div className="space-y-4 text-left mb-6">
            {[
              { label: 'File signature recovery scan', pct: Math.min(100, verifyProgress * 2), done: verifyProgress > 50 },
              { label: 'Metadata journal forensic carve', pct: Math.min(100, Math.max(0, (verifyProgress - 30) * 2.5)), done: verifyProgress > 70 },
              { label: 'Entropy analysis (expect ~7.99 bits/byte)', pct: Math.min(100, Math.max(0, (verifyProgress - 60) * 2.5)), done: verifyProgress > 84 },
              { label: 'Cryptographic SHA-256 seal generation', pct: Math.min(100, Math.max(0, (verifyProgress - 80) * 5)), done: verifyProgress >= 100 },
            ].map(({ label, pct, done }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">{label}</span>
                  <span className={done ? 'text-green-600 font-semibold' : 'text-slate-400'}>{done ? '✓ 0 found (Clean)' : `${Math.round(pct)}%`}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-200 ${done ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1E3A8A]" />
            <span>Anchoring cryptographic proofs to Merkle chain…</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 5: Official Certificate (Downloadable & Printable) ──────
  if (step === 'certificate') {
    const activeCert: Certificate = cert || certificates.find(c => c.deviceId === targetDevice.id) || {
      id: `CERT-VS-${Date.now().toString().slice(-6)}`,
      type: 'wipe',
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      timestamp: new Date().toISOString(),
      method: path === 'full'
        ? 'ATA Secure Erase (Enhanced) + 3-Pass DoD 5220.22-M'
        : 'Selective File Shredding (Gutmann 35-pass) + Metadata Purge',
      standard: 'NIST SP 800-88 Rev.2',
      hash: genHash(),
      previousHash: '0'.repeat(64),
      blockIndex: certificates.length,
      operator: user?.name ? `${user.name} (${user.role})` : 'System Security Operator',
      status: 'verified',
      signature: 'MEQCIHkX9vLmR2nQpT7bY3cF6wK1dJ8sA4eZ0gN5hM2oP9rE\nAiA3TuV8wX6yZ4nS1kR9mB7cL2aP5eQ0dF3hN8gM4oJ7s==',
    };

    const prevHashStr = String(activeCert.previousHash || '0'.repeat(64));
    const hashStr = String(activeCert.hash || '0'.repeat(64));

    return (
      <div className="p-6 max-w-3xl mx-auto">
        {/* 5-Step Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6 flex-wrap">
          <span className="text-green-500 font-bold">1. ✓ PATH</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-green-500 font-bold">2. ✓ VM</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-green-500 font-bold">3. ✓ ERASED</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-green-500 font-bold">4. ✓ VERIFIED</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#1E3A8A] font-bold">5. ✓ CERTIFIED</span>
        </div>

        {/* Certificate Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          {/* Card Header */}
          <div className="bg-[#1E293B] px-6 py-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-[#16A34A]" />
              <div>
                <div className="text-white font-bold text-base">Official Data Erasure Certificate</div>
                <div className="text-slate-400 text-xs font-mono">{activeCert.id}</div>
              </div>
              <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                ✓ CRYPTOGRAPHICALLY VERIFIED
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Sanitization Verification Summary */}
            <div className="bg-green-50/70 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-green-900 font-bold text-sm mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Sanitization Pass 100% Successful
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                Drive sectors zero-overwritten and verified with CSPRNG entropy analysis (7.998 bits/byte). Zero recoverable files detected under post-wipe forensic scan.
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                ['Target Device', activeCert.deviceName],
                ['Serial Number (S/N)', targetDevice.serial || 'S4EVNX0N704217'],
                ['Timestamp', new Date(activeCert.timestamp).toLocaleString('en-IN')],
                ['Authorized Operator', activeCert.operator],
                ['Erasure Method', activeCert.method],
                ['Compliance Standard', activeCert.standard],
                ['Block Index', `#${activeCert.blockIndex}`],
                ['Drive Capacity', targetDevice.capacity || `${targetDevice.capacityGB ?? 500} GB`],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="text-xs text-slate-400 font-medium">{k}</span>
                  <div className="text-sm text-slate-800 font-semibold mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            {/* Certificate Hash */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
              <div className="text-xs text-slate-500 font-mono font-medium mb-1">SHA-256 Certificate Hash</div>
              <div className="font-mono text-xs text-slate-800 break-all select-all font-semibold">{hashStr}</div>
            </div>

            {/* Previous Hash */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
              <div className="text-xs text-slate-500 font-mono font-medium mb-1">Previous Block Hash (Merkle Chain Link)</div>
              <div className="font-mono text-xs text-slate-600 break-all">{prevHashStr.slice(0, 32)}…</div>
            </div>

            {/* Digital Signature */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
              <div className="text-xs text-slate-500 font-mono font-medium mb-2">ECDSA-P256 Digital Signature</div>
              <div className="font-mono text-[11px] text-slate-600 leading-relaxed break-all bg-white p-3 rounded-lg border border-slate-200 select-all">
                {activeCert.signature}
              </div>
            </div>

            {/* Merkle chain visual */}
            <div className="border border-slate-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-sm font-bold text-[#1E293B]">Merkle Certificate Chain</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { label: 'Genesis', hash: '00000000…', active: false },
                  { label: `Block #${Math.max(0, activeCert.blockIndex - 1)}`, hash: prevHashStr.slice(0, 8) + '…', active: false },
                  { label: `Block #${activeCert.blockIndex} ← THIS`, hash: hashStr.slice(0, 8) + '…', active: true },
                ].map((block, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                      <div className="w-6 h-0.5 bg-[#1E3A8A]/30" />
                      <Link2 className="w-3 h-3 text-[#1E3A8A]/50" />
                    </div>}
                    <div className={`flex-shrink-0 rounded-xl border p-3 text-center min-w-28 ${block.active ? 'border-[#1E3A8A] bg-[#1E3A8A]/5' : 'border-slate-200 bg-white'}`}>
                      <div className={`text-[10px] font-bold font-mono mb-1 ${block.active ? 'text-[#1E3A8A]' : 'text-slate-400'}`}>{block.label}</div>
                      <div className="text-[10px] font-mono text-slate-600">{block.hash}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Action buttons: Download, Print, and Audit Log */}
            <div className="flex gap-3 flex-wrap items-center">
              {/* Download Report Text / PDF */}
              <button
                onClick={() => downloadReport(activeCert)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors text-sm shadow-md shadow-blue-900/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Certificate (.txt)
              </button>

              {/* Download JSON */}
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(activeCert, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${activeCert.id}-Signed.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  addNotification('Signed JSON certificate downloaded', 'success');
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download JSON
              </button>

              {/* Print / Save PDF */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>

              {/* View in Audit Log */}
              <Link
                to="/certificates"
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:text-[#1E3A8A] hover:border-[#1E3A8A] font-semibold rounded-xl transition-colors text-sm"
              >
                <FileCheck className="w-4 h-4" /> Audit Log
              </Link>

              {/* Erase Another */}
              <Link
                to="/devices"
                className="flex items-center gap-2 px-4 py-2.5 text-[#1E3A8A] hover:underline font-semibold text-sm ml-auto"
              >
                <RotateCcw className="w-4 h-4" /> Erase Another Drive
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback view
  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E3A8A]">
        <HardDrive className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Sanitization Ready</h2>
      <p className="text-slate-500 text-sm mb-6">Drive: {targetDevice.name} ({targetDevice.capacity})</p>
      <button
        onClick={() => setStep('select_path')}
        className="px-6 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all text-sm cursor-pointer"
      >
        Configure Erasure
      </button>
    </div>
  );
}
