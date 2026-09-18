import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  RotateCcw, HardDrive, ChevronRight, Loader2, FileCheck,
  Download, Image, FileText, Video, Music, Archive, Table,
  CheckCircle, ArrowLeft, Search, Cpu, Database, Filter, Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_RECOVERY_FILES, RecoveryFile, SCAN_LOG_LINES, Certificate } from '../mockData';

type Step = 'scan' | 'results' | 'restoring' | 'verify' | 'report';
type FileType = 'all' | RecoveryFile['type'];

const FileIcon = ({ type }: { type: RecoveryFile['type'] }) => {
  const cls = "w-4 h-4";
  if (type === 'image') return <Image className={cls} />;
  if (type === 'video') return <Video className={cls} />;
  if (type === 'audio') return <Music className={cls} />;
  if (type === 'archive') return <Archive className={cls} />;
  if (type === 'spreadsheet') return <Table className={cls} />;
  return <FileText className={cls} />;
};

const fileColors: Record<RecoveryFile['type'], string> = {
  image: 'bg-pink-100 text-pink-600',
  document: 'bg-blue-100 text-blue-600',
  video: 'bg-purple-100 text-purple-600',
  audio: 'bg-amber-100 text-amber-600',
  archive: 'bg-slate-100 text-slate-600',
  spreadsheet: 'bg-green-100 text-green-600',
};

const genHash = () => Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export default function Recover() {
  const { deviceId } = useParams();
  const { devices, addCertificate, markDeviceRecovered, addNotification, certificates, user } = useApp();
  const safeDevices = devices || [];
  const device = (deviceId ? safeDevices.find(d => d.id === deviceId) : undefined)
    || safeDevices.find(d => !d.erased && d.status !== 'physical_damage')
    || safeDevices[0];

  const [step, setStep] = useState<Step>('scan');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [files] = useState<RecoveryFile[]>(MOCK_RECOVERY_FILES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<FileType>('all');
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [cert, setCert] = useState<Certificate | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [scanLog]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (!device) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">No active storage device available for recovery.</p>
        <Link to="/devices" className="text-[#1E3A8A] text-sm font-medium mt-2 inline-block">← Back to Devices</Link>
      </div>
    );
  }

  const startScan = () => {
    setScanProgress(0);
    setScanLog([]);
    setFoundCount(0);

    const lines = SCAN_LOG_LINES.map(l =>
      l.replace('{device}', device.name)
       .replace('{capacity}', device.capacity)
       .replace('{count}', String(MOCK_RECOVERY_FILES.length))
    );

    let lineIdx = 0;
    const totalMs = 5000;
    const lineInterval = Math.max(80, totalMs / lines.length);

    const lineTimer = setInterval(() => {
      if (lineIdx < lines.length) {
        const lineToAdd = lines[lineIdx];
        lineIdx++;
        if (lineToAdd) {
          setScanLog(prev => [...prev, lineToAdd]);
        }
      } else {
        clearInterval(lineTimer);
      }
    }, lineInterval);

    let curProg = 0;
    const stepIncrement = 100 / (totalMs / 100);
    timerRef.current = setInterval(() => {
      curProg += stepIncrement;
      if (curProg >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setScanProgress(100);
        setFoundCount(MOCK_RECOVERY_FILES.length);
        setTimeout(() => setStep('results'), 400);
      } else {
        setScanProgress(Math.min(99, Math.round(curProg)));
        setFoundCount(Math.floor((curProg / 100) * MOCK_RECOVERY_FILES.length));
      }
    }, 100);
  };

  const startRestore = () => {
    if (selected.size === 0) {
      const all = new Set(files.map(f => f.id));
      setSelected(all);
    }
    setStep('restoring');
    setRestoreProgress(0);
    timerRef.current = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current!);
          setTimeout(() => startVerify(), 400);
          return 100;
        }
        return prev + 3;
      });
    }, 100);
  };

  const startVerify = () => {
    setStep('verify');
    setVerifyProgress(0);
    timerRef.current = setInterval(() => {
      setVerifyProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current!);
          setTimeout(() => finishRecovery(), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  const finishRecovery = () => {
    const hash = genHash();
    const prevHash = (certificates && certificates.length > 0 && certificates[0]?.hash)
      ? String(certificates[0].hash)
      : '0'.repeat(64);
    const newCert: Certificate = {
      id: `CERT-REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: 'recovery',
      deviceId: device.id,
      deviceName: device.name,
      timestamp: new Date().toISOString(),
      method: 'Deep Forensic Scan + File Carving (Signature + Journal)',
      standard: 'ISO/IEC 27040:2024',
      hash,
      previousHash: prevHash,
      blockIndex: certificates ? certificates.length : 0,
      operator: user?.name ? `${user.name} (${user.role})` : 'Forensic Recovery Auditor',
      status: 'verified',
      signature: Array.from({ length: 2 }, () =>
        Array.from({ length: 44 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[Math.floor(Math.random() * 64)]).join('')
      ).join('\n'),
      filesRecovered: selected.size || files.length,
      successRate: 94.2,
    };
    addCertificate(newCert);
    markDeviceRecovered(device.id);
    setCert(newCert);
    setStep('report');
    addNotification(`Recovery complete — ${newCert.filesRecovered} files restored from ${device.name}`, 'success');
  };

  const downloadTextReport = (c: Certificate) => {
    const reportText = [
      '================================================================================',
      '                     VOIDSEEK FORENSIC RECOVERY CERTIFICATE                     ',
      '                         ISO/IEC 27040:2024 COMPLIANT                           ',
      '================================================================================',
      '',
      `Certificate Identifier : ${c.id}`,
      `Issuance Timestamp     : ${new Date(c.timestamp).toUTCString()}`,
      `Validation Status      : VERIFIED & CRYPTOGRAPHICALLY SEALED`,
      `Authorized Operator    : ${c.operator}`,
      `Security Standard      : ${c.standard}`,
      `Recovery Methodology  : ${c.method}`,
      '',
      '── HARDWARE SPECIFICATIONS ─────────────────────────────────────────────────────',
      `Device Name            : ${device.name}`,
      `Interface Type         : ${device.interface || 'SATA'}`,
      `Storage Capacity       : ${device.capacity}`,
      `Firmware Revision      : ${device.firmware || 'Rev 1.0'}`,
      '',
      '── RECOVERY METRICS ────────────────────────────────────────────────────────────',
      `Files Carved & Restored: ${c.filesRecovered || 0}`,
      `Success Integrity Rate : ${c.successRate || 94.2}%`,
      'Sector Resolution      : 512 bytes / sector',
      'Forensic Carving Pass  : Complete (Deep Signature + Journal Reassembly)',
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
    a.download = `${c.id}-Forensic-Recovery-Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Forensic recovery certificate downloaded (.txt)', 'success');
  };

  const filtered = files.filter(f => filterType === 'all' || f.type === filterType);
  const typeCounts = files.reduce((acc, f) => { acc[f.type] = (acc[f.type] || 0) + 1; return acc; }, {} as Record<string, number>);

  const BREADCRUMB = (
    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6 flex-wrap">
      {(['scan', 'results', 'restoring', 'verify', 'report'] as Step[]).map((s, i, arr) => {
        const labels: Record<Step, string> = { scan: '1. SCAN', results: '2. SELECT FILES', restoring: '3. RESTORE', verify: '4. VERIFY', report: '5. REPORT' };
        const done = arr.indexOf(step) > i;
        const active = step === s;
        return (
          <React.Fragment key={s}>
            <span className={`font-bold ${done ? 'text-green-500' : active ? 'text-[#1E3A8A]' : 'text-slate-400'}`}>
              {done ? '✓' : ''} {labels[s]}
            </span>
            {i < arr.length - 1 && <ChevronRight className="w-3 h-3" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ─── Scan step ─────────────────────────────────────────────────────
  if (step === 'scan') {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link to="/devices" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Devices
        </Link>
        {BREADCRUMB}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              {device.type === 'NVMe' ? <Cpu className="w-5 h-5 text-green-600" /> :
               device.type === 'USB' ? <Database className="w-5 h-5 text-green-600" /> :
               <HardDrive className="w-5 h-5 text-green-600" />}
            </div>
            <div>
              <h2 className="font-bold text-[#1E293B]">{device.name}</h2>
              <p className="text-xs text-slate-400">{device.type} · {device.interface} · {device.capacity}</p>
            </div>
          </div>
        </div>

        {scanProgress === 0 ? (
          <div className="text-center py-12">
            <RotateCcw className="w-12 h-12 text-[#1E3A8A]/30 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#1E293B] mb-2">Ready to Scan</h2>
            <p className="text-slate-500 text-sm mb-8">Deep forensic scan using file-signature carving, NTFS journal analysis, and MFT record cross-referencing.</p>
            <button onClick={startScan} className="px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all hover:shadow-lg">
              Begin Deep Scan
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#1E293B]">Scanning…</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Recoverable files found: <span className="font-bold text-green-600">{foundCount}</span></p>
                </div>
                <span className="font-mono font-bold text-[#1E3A8A]">{Math.round(scanProgress)}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-200"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                {[
                  ['Signature matches', Math.floor(foundCount * 0.7)],
                  ['Journal entries', Math.floor(foundCount * 0.2)],
                  ['Carved fragments', Math.floor(foundCount * 0.1)],
                ].map(([label, val]) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-slate-700 text-base">{val as number}</div>
                    <div className="text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-mono text-slate-400">Recovery Scan Log</span>
              </div>
              <div ref={logRef} className="p-5 font-mono text-xs space-y-1.5 h-48 overflow-y-auto">
                {scanLog.map((line, i) => {
                  const s = line || '';
                  const color = s.startsWith('[FOUND]') ? 'text-green-400' :
                                s.startsWith('[DONE]') ? 'text-green-400' :
                                s.startsWith('[MATCH]') ? 'text-cyan-400' :
                                s.startsWith('[STEP') ? 'text-blue-400' :
                                'text-slate-300';
                  return <div key={i} className={color}>{s}</div>;
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Results step ──────────────────────────────────────────────────
  if (step === 'results') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {BREADCRUMB}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#1E293B]">Recoverable Files</h2>
            <p className="text-slate-500 text-sm mt-0.5">{files.length} files found · Select files to restore or restore all</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set(filtered.map(f => f.id)))}
              className="px-3 py-1.5 bg-[#1E3A8A]/10 text-[#1E3A8A] text-xs font-semibold rounded-lg hover:bg-[#1E3A8A]/20 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', ...Object.keys(typeCounts)] as FileType[]).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterType === t ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
            >
              {t === 'all' ? `All (${files.length})` : `${t} (${typeCounts[t]})`}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 bg-slate-50 border-b border-slate-100">
            <div className="w-8"></div>
            <div>File</div>
            <div className="pr-8">Size</div>
            <div className="pr-8">Confidence</div>
            <div>Original Path</div>
          </div>
          {filtered.map((file, i) => (
            <div
              key={file.id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 items-center px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${i < filtered.length - 1 ? 'border-b border-slate-100' : ''} ${selected.has(file.id) ? 'bg-blue-50/50' : ''}`}
              onClick={() => {
                const s = new Set(selected);
                s.has(file.id) ? s.delete(file.id) : s.add(file.id);
                setSelected(s);
              }}
            >
              <div className="w-8">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selected.has(file.id) ? 'bg-[#1E3A8A] border-[#1E3A8A]' : 'border-slate-300'}`}>
                  {selected.has(file.id) && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg ${fileColors[file.type]} flex items-center justify-center flex-shrink-0`}>
                  <FileIcon type={file.type} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-700 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">{file.extension}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 pr-8">{file.size}</div>
              <div className="pr-8">
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${file.confidence >= 90 ? 'bg-green-500' : file.confidence >= 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${file.confidence}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${file.confidence >= 90 ? 'text-green-600' : file.confidence >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{file.confidence}%</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-mono truncate max-w-32 hidden lg:block">{file.originalPath}</div>
            </div>
          ))}
        </div>

        <button
          onClick={startRestore}
          className="px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all hover:shadow-lg"
        >
          Restore {selected.size > 0 ? `${selected.size} Selected Files` : 'All Files'} →
        </button>
      </div>
    );
  }

  // ─── Restoring step ────────────────────────────────────────────────
  if (step === 'restoring') {
    const count = selected.size || files.length;
    const restored = Math.floor((restoreProgress / 100) * count);
    return (
      <div className="p-6 max-w-3xl mx-auto">
        {BREADCRUMB}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mx-auto mb-5">
            <RotateCcw className="w-8 h-8 text-[#1E3A8A]" style={{ animation: 'spin 1.5s linear infinite' }} />
          </div>
          <h2 className="text-lg font-extrabold text-[#1E293B] mb-2">Restoring Files</h2>
          <p className="text-slate-500 text-sm mb-6">Copying to destination — maintaining original timestamps, metadata, and NTFS attributes.</p>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
              <span>{restored} / {count} files</span>
              <span>{Math.round(restoreProgress)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-full transition-all duration-200"
                style={{ width: `${restoreProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-left">
            <div className="text-xs font-mono text-slate-400">
              Destination: <span className="text-slate-600">D:\VoidSeek_Recovery_{new Date().toISOString().slice(0,10)}\</span>
            </div>
            {restoreProgress > 10 && <div className="text-xs font-mono text-green-500 mt-1">▶ Restoring {files[Math.min(restored, files.length - 1)]?.name}…</div>}
          </div>
        </div>
      </div>
    );
  }

  // ─── Verify step ───────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        {BREADCRUMB}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-[#1E293B]">Integrity Verification</h2>
              <p className="text-sm text-slate-500">Comparing checksums and validating recovered file structure</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Checksum comparison (SHA-256)', pct: Math.min(100, verifyProgress * 2) },
              { label: 'File structure validation', pct: Math.min(100, Math.max(0, (verifyProgress - 20) * 2)) },
              { label: 'Metadata integrity check', pct: Math.min(100, Math.max(0, (verifyProgress - 50) * 2.5)) },
              { label: 'Recovery confidence scoring', pct: Math.min(100, Math.max(0, (verifyProgress - 75) * 4)) },
            ].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600">{label}</span>
                  <span className={pct >= 100 ? 'text-green-600 font-semibold' : 'text-slate-400'}>{pct >= 100 ? '✓ Passed' : `${Math.round(pct)}%`}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-200 ${pct >= 100 ? 'bg-green-500' : 'bg-[#1E3A8A]'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Report step ───────────────────────────────────────────────────
  if (step === 'report' && cert) {
    const count = cert.filesRecovered || 0;
    return (
      <div className="p-6 max-w-3xl mx-auto">
        {BREADCRUMB}

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" strokeWidth={1.5} />
          <h2 className="text-xl font-extrabold text-green-800 mb-1">Recovery Complete</h2>
          <p className="text-green-600 text-sm">{count} files successfully restored from {device.name}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Files Recovered', value: String(count) },
            { label: 'Success Rate', value: `${cert.successRate}%` },
            { label: 'Avg Confidence', value: '94.7%' },
            { label: 'Total Size', value: '1.2 GB' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="text-2xl font-extrabold text-[#1E293B] mb-1">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="font-bold text-[#1E293B]">Recovery Certificate</h3>
            <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">VERIFIED</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm mb-4">
            {[
              ['Certificate ID', cert.id],
              ['Standard', cert.standard],
              ['Method', cert.method.split('+')[0].trim()],
              ['Block #', String(cert.blockIndex)],
              ['Timestamp', new Date(cert.timestamp).toLocaleString('en-IN')],
              ['Operator', cert.operator],
            ].map(([k, v]) => (
              <div key={k}><span className="text-xs text-slate-400">{k}</span><div className="font-medium text-slate-700 text-xs mt-0.5">{v}</div></div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-500 break-all">
            hash: {cert.hash}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <button
            onClick={() => downloadTextReport(cert)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors text-sm shadow-md shadow-blue-900/20 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Certificate (.txt)
          </button>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${cert.id}-Recovery.json`;
              a.click();
              URL.revokeObjectURL(url);
              addNotification('Signed JSON certificate downloaded', 'success');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download JSON
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <Link
            to="/certificates"
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:text-[#1E3A8A] hover:border-[#1E3A8A] font-semibold rounded-xl transition-colors text-sm"
          >
            <FileCheck className="w-4 h-4" /> View in Audit Log
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
