import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEVICES, CERTIFICATES, Device, Certificate } from '../mockData';

interface User {
  email: string;
  name: string;
  role: 'Individual' | 'Enterprise Admin' | 'Forensic Auditor';
  org: string;
  avatar: string;
}

interface AppState {
  user: User | null;
  devices: Device[];
  certificates: Certificate[];
  notifications: { id: string; message: string; type: 'success' | 'warning' | 'error' | 'info' }[];
  login: (email: string, role: User['role']) => void;
  logout: () => void;
  addCertificate: (cert: Certificate) => void;
  markDeviceErased: (deviceId: string) => void;
  markDeviceRecovered: (deviceId: string) => void;
  addNotification: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'voidseek_state';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s).user : null;
    } catch { return null; }
  });

  const [devices, setDevices] = useState<Device[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      const parsed = s ? JSON.parse(s) : null;
      if (parsed && Array.isArray(parsed.devices) && parsed.devices.length > 0) {
        return parsed.devices;
      }
      return DEVICES;
    } catch { return DEVICES; }
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      const parsed = s ? JSON.parse(s) : null;
      if (parsed && Array.isArray(parsed.certificates) && parsed.certificates.length > 0) {
        const seen = new Set<string>();
        const deduped: Certificate[] = [];
        for (const c of parsed.certificates) {
          if (c && c.id && !seen.has(c.id)) {
            seen.add(c.id);
            deduped.push(c);
          }
        }
        return deduped.length > 0 ? deduped : CERTIFICATES;
      }
      return CERTIFICATES;
    } catch { return CERTIFICATES; }
  });

  const [notifications, setNotifications] = useState<AppState['notifications']>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user,
        devices: devices || DEVICES,
        certificates: certificates || CERTIFICATES
      }));
    } catch {
      // ignore storage errors
    }
  }, [user, devices, certificates]);

  const login = (email: string, role: User['role']) => {
    const names: Record<User['role'], string> = {
      'Individual': 'Rahul Verma',
      'Enterprise Admin': 'Atharv',
      'Forensic Auditor': 'Arjun Mehta',
    };
    setUser({
      email,
      name: names[role],
      role,
      org: 'VoidSeek Security Labs',
      avatar: names[role].split(' ').map(n => n[0]).join(''),
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addCertificate = (cert: Certificate) => {
    setCertificates(prev => {
      const base = prev || CERTIFICATES;
      const filtered = base.filter(c => c.id !== cert.id);
      return [cert, ...filtered];
    });
  };

  const markDeviceErased = (deviceId: string) => {
    setDevices(prev => (prev || DEVICES).map(d => d.id === deviceId ? { ...d, erased: true } : d));
  };

  const markDeviceRecovered = (deviceId: string) => {
    setDevices(prev => (prev || DEVICES).map(d => d.id === deviceId ? { ...d, recovered: true } : d));
  };

  const addNotification = (message: string, type: AppState['notifications'][0]['type']) => {
    const id = Math.random().toString(36).slice(2);
    setNotifications(prev => [...(prev || []), { id, message, type }]);
    setTimeout(() => dismissNotification(id), 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => (prev || []).filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, devices, certificates, notifications,
      login, logout, addCertificate, markDeviceErased, markDeviceRecovered,
      addNotification, dismissNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
