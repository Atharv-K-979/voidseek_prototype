import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HardDrive, Search, Filter, Trash2, RotateCcw, AlertTriangle, Cpu, Database, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Device } from '../mockData';

const PlatformBadge = ({ platform }: { platform: Device['platform'] }) => {
  const colors: Record<Device['platform'], string> = {
    Windows: 'bg-blue-100 text-blue-700',
    Linux: 'bg-orange-100 text-orange-700',
    Android: 'bg-green-100 text-green-700',
    'Bare-metal': 'bg-slate-100 text-slate-600',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[platform]}`}>{platform}</span>;
};

export default function Devices() {
  const { devices } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Device['type']>('all');

  const filtered = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.model.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1E293B] mb-1">Devices</h1>
        <p className="text-slate-500 text-sm">All detected storage devices across your environment.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search devices…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'HDD', 'SSD', 'NVMe', 'USB'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${filter === f ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
            >
              {f === 'all' ? 'All Types' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Device cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(device => (
          <div key={device.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all ${device.status === 'physical_damage' ? 'border-red-200' : 'border-slate-200'}`}>
            {/* Card header */}
            <div className={`px-5 py-4 ${device.status === 'physical_damage' ? 'bg-red-50' : 'bg-slate-50'} border-b ${device.status === 'physical_damage' ? 'border-red-100' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {device.type === 'NVMe' ? <Cpu className="w-4 h-4 text-[#1E3A8A]" /> :
                   device.type === 'USB' ? <Database className="w-4 h-4 text-[#1E3A8A]" /> :
                   <HardDrive className="w-4 h-4 text-[#1E3A8A]" />}
                  <span className="text-xs font-mono font-bold text-slate-500">{device.type}</span>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {device.hasHPA && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">HPA</span>}
                  {device.hasDCO && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">DCO</span>}
                  {device.erased && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold">ERASED</span>}
                  {device.status === 'physical_damage' && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-bold">DAMAGED</span>}
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="font-bold text-[#1E293B] text-sm mb-1 truncate">{device.name}</div>
              <div className="text-xs text-slate-400 mb-4">{device.model} · S/N: {device.serial}</div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div><span className="text-slate-400">Interface</span><br /><span className="font-medium text-slate-700">{device.interface}</span></div>
                <div><span className="text-slate-400">Capacity</span><br /><span className="font-medium text-slate-700">{device.capacity}</span></div>
                <div><span className="text-slate-400">Firmware</span><br /><span className="font-mono font-medium text-slate-700">{device.firmware}</span></div>
                <div><span className="text-slate-400">Platform</span><br /><PlatformBadge platform={device.platform} /></div>
              </div>

              {/* Health */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Drive Health</span>
                  <span className={`font-semibold ${device.health >= 80 ? 'text-green-600' : device.health >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{device.health}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${device.health >= 80 ? 'bg-green-500' : device.health >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${device.health}%` }}
                  />
                </div>
              </div>

              {/* Storage bar */}
              {device.status !== 'physical_damage' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Storage Used</span>
                    <span className="text-slate-600 font-medium">{device.usedGB} / {device.capacityGB} GB</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1E3A8A]/40 rounded-full" style={{ width: `${(device.usedGB / device.capacityGB) * 100}%` }} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {device.status === 'physical_damage' ? (
                  <Link to={`/erase/${device.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-semibold hover:bg-red-200 transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" /> Escalate
                  </Link>
                ) : device.erased ? (
                  <div className="flex-1 text-center py-2 bg-green-100 text-green-700 rounded-xl text-xs font-semibold">✓ Erased & Certified</div>
                ) : (
                  <>
                    <Link to={`/erase/${device.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-semibold hover:bg-[#1d4ed8] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Erase
                    </Link>
                    <Link to={`/recover/${device.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Recover
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <HardDrive className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No devices match your search</p>
        </div>
      )}
    </div>
  );
}
