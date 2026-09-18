import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, HardDrive, Leaf, Shield, Database, FileCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MONTHLY_DATA = [
  { month: 'Apr', wiped: 8, recovered: 5, capacity: 12 },
  { month: 'May', wiped: 14, recovered: 9, capacity: 28 },
  { month: 'Jun', wiped: 11, recovered: 7, capacity: 22 },
  { month: 'Jul', wiped: 19, recovered: 12, capacity: 38 },
  { month: 'Aug', wiped: 23, recovered: 15, capacity: 51 },
  { month: 'Sep', wiped: 31, recovered: 18, capacity: 67 },
];

const PIE_DATA = [
  { name: 'HDD', value: 42, color: '#1E3A8A' },
  { name: 'SSD', value: 28, color: '#2563EB' },
  { name: 'NVMe', value: 18, color: '#60A5FA' },
  { name: 'USB', value: 12, color: '#93C5FD' },
];

const COMPLIANCE_DATA = [
  { standard: 'NIST 800-88', compliance: 100 },
  { standard: 'IEEE 2883', compliance: 100 },
  { standard: 'ISO 27040', compliance: 96 },
  { standard: 'DoD 5220', compliance: 100 },
];

const IMPACT_CARDS = [
  { icon: Database, label: 'Storage Capacity Reclaimed', value: '218 TB', sub: 'Across 106 devices this quarter', color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
  { icon: TrendingUp, label: 'Estimated Cost Savings', value: '₹4.2 Cr', sub: 'vs. physical destruction + new procurement', color: 'text-green-600', bg: 'bg-green-100' },
  { icon: Leaf, label: 'E-Waste Avoided', value: '1.8 tonnes', sub: 'Devices resold/reused instead of destroyed', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { icon: FileCheck, label: 'Certificates Issued', value: '247', sub: 'Tamper-evident, chain-linked', color: 'text-purple-600', bg: 'bg-purple-100' },
  { icon: Shield, label: 'Compliance Rate', value: '99.6%', sub: 'Operations meeting NIST/IEEE standards', color: 'text-amber-600', bg: 'bg-amber-100' },
  { icon: HardDrive, label: 'Devices Processed', value: '106', sub: 'Wiped, recovered, or escalated', color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-bold text-slate-700 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 capitalize">{p.name}:</span>
            <span className="font-semibold text-slate-700">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { devices, certificates } = useApp();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1E293B] mb-1">Reports & Impact Dashboard</h1>
        <p className="text-slate-500 text-sm">Operational metrics, compliance status, and sustainability impact — YTD 2026.</p>
      </div>

      {/* Impact cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {IMPACT_CARDS.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className={`text-2xl font-extrabold ${color} mb-0.5`}>{value}</div>
              <div className="text-sm font-semibold text-slate-700">{label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly operations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-[#1E293B] mb-1">Devices Processed Over Time</h3>
          <p className="text-xs text-slate-400 mb-5">Monthly wipe and recovery operations</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="wiped" name="Wiped" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recovered" name="Recovered" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device type split */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-[#1E293B] mb-1">Device Type Split</h3>
          <p className="text-xs text-slate-400 mb-5">By storage interface</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {PIE_DATA.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
                <span className="text-slate-500">{name}</span>
                <span className="font-semibold text-slate-700 ml-auto">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Capacity reclaimed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-[#1E293B] mb-1">Storage Capacity Reclaimed (TB)</h3>
          <p className="text-xs text-slate-400 mb-5">Cumulative this fiscal year</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="capacity"
                name="TB Reclaimed"
                stroke="#16A34A"
                strokeWidth={2.5}
                dot={{ fill: '#16A34A', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-[#1E293B] mb-1">Compliance Status</h3>
          <p className="text-xs text-slate-400 mb-5">Adherence to active standards</p>
          <div className="space-y-4">
            {COMPLIANCE_DATA.map(({ standard, compliance }) => (
              <div key={standard}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{standard}</span>
                  <span className={`font-bold ${compliance === 100 ? 'text-green-600' : 'text-amber-600'}`}>{compliance}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${compliance === 100 ? 'bg-green-500' : 'bg-amber-400'}`}
                    style={{ width: `${compliance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 pulse-ring" />
              <span className="text-slate-600 font-medium">All critical standards: <span className="text-green-600 font-bold">COMPLIANT</span></span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Last audit: {new Date().toLocaleDateString('en-IN')} · Next scheduled: {new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
