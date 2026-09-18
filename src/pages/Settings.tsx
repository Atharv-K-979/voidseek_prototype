import React, { useState } from 'react';
import { Shield, Bell, Key, Globe, Check, ChevronRight, Copy, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STANDARDS = [
  { id: 'nist', label: 'NIST SP 800-88 Rev.2', desc: 'Media Sanitization Guidelines — DoD-endorsed, most widely recognized' },
  { id: 'ieee2883', label: 'IEEE 2883-2022', desc: 'Standard for Sanitizing Storage — international hardware-level specification' },
  { id: 'ieee28831', label: 'IEEE 2883.1-2025', desc: 'Sanitization Procedures — detailed procedural annex to IEEE 2883' },
  { id: 'iso27040', label: 'ISO/IEC 27040:2024', desc: 'Storage Security — international standard for storage asset management' },
  { id: 'dod', label: 'DoD 5220.22-M', desc: 'National Industrial Security Program — 3-pass/7-pass overwrite standard' },
];

const MOCK_API_KEYS = [
  { name: 'Production API Key', key: 'vs_prod_a3b8f2e1d9c7...', created: '2026-08-01', lastUsed: '2026-09-18' },
  { name: 'Audit Integration Key', key: 'vs_audit_x9k2m4n1p0q3...', created: '2026-07-15', lastUsed: '2026-09-17' },
];

export default function Settings() {
  const { user, addNotification } = useApp();
  const [activeSection, setActiveSection] = useState('org');
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['nist', 'ieee2883', 'dod']);
  const [notifications, setNotifications] = useState({
    wipeComplete: true,
    recoveryComplete: true,
    certIssued: true,
    healthAlert: true,
    weeklyReport: false,
  });
  const [showKey, setShowKey] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleStandard = (id: string) => {
    setSelectedStandards(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaved(true);
    addNotification('Settings saved successfully', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    addNotification('API key copied to clipboard (read-only in this preview)', 'info');
  };

  const SECTIONS = [
    { id: 'org', icon: Globe, label: 'Organization' },
    { id: 'compliance', icon: Shield, label: 'Compliance Standards' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'api', icon: Key, label: 'API Keys' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1E293B] mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your organization, compliance preferences, and integrations.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {SECTIONS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeSection === id ? 'bg-[#1E3A8A] text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Organization */}
          {activeSection === 'org' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-[#1E293B] mb-5">Organization Profile</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input defaultValue={user?.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Role</label>
                    <input defaultValue={user?.role} readOnly className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Organization</label>
                  <input defaultValue={user?.org} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Time Zone</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#1E3A8A] bg-white">
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>America/New_York (EST, UTC-5)</option>
                    <option>Europe/London (GMT, UTC+0)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button onClick={handleSave} className="px-6 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors text-sm flex items-center gap-2">
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Compliance */}
          {activeSection === 'compliance' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-bold text-[#1E293B]">Compliance Standard Selector</h2>
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Cosmetic — for display purposes</span>
              </div>
              <p className="text-sm text-slate-500 mb-5">Select which standards govern certificate generation and audit reports for your organization.</p>
              <div className="space-y-3">
                {STANDARDS.map(({ id, label, desc }) => (
                  <div
                    key={id}
                    onClick={() => toggleStandard(id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedStandards.includes(id) ? 'border-[#1E3A8A] bg-[#1E3A8A]/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${selectedStandards.includes(id) ? 'bg-[#1E3A8A] border-[#1E3A8A]' : 'border-slate-300'}`}>
                      {selectedStandards.includes(id) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 text-sm">{label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button onClick={handleSave} className="px-6 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors text-sm">
                  {saved ? '✓ Saved' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-[#1E293B] mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    wipeComplete: 'Wipe operation complete',
                    recoveryComplete: 'Recovery operation complete',
                    certIssued: 'Certificate issued',
                    healthAlert: 'Drive health alert (below 50%)',
                    weeklyReport: 'Weekly summary report',
                  };
                  return (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-700">{labels[key]}</span>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !val }))}
                        className={`w-11 h-6 rounded-full transition-colors ${val ? 'bg-[#1E3A8A]' : 'bg-slate-200'} relative`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${val ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <button onClick={handleSave} className="px-6 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors text-sm">
                  {saved ? '✓ Saved' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* API Keys */}
          {activeSection === 'api' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-bold text-[#1E293B]">API Key Management</h2>
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Read-only in this preview</span>
              </div>
              <p className="text-sm text-slate-500 mb-5">API keys for integrating VoidSeek with your SIEM, asset management, or compliance platform.</p>

              <div className="space-y-4 mb-6">
                {MOCK_API_KEYS.map((k, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-slate-700 text-sm">{k.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Created {k.created} · Last used {k.lastUsed}</div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-xs bg-slate-50 px-3 py-2 rounded-lg text-slate-500 truncate">
                        {showKey === i ? k.key : k.key.slice(0, 12) + '••••••••••••••••••'}
                      </div>
                      <button onClick={() => setShowKey(showKey === i ? null : i)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        {showKey === i ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyKey(k.key)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addNotification('API key generation is read-only in this preview', 'info')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                <Key className="w-4 h-4" /> Generate New Key (read-only)
              </button>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                <strong>Preview mode:</strong> API key operations are disabled in this demonstration. In production, keys are generated with scoped permissions and can be revoked individually.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
