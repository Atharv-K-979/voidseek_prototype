export type DeviceType = 'HDD' | 'SSD' | 'NVMe' | 'USB';
export type DeviceStatus = 'healthy' | 'warning' | 'critical' | 'physical_damage';
export type Platform = 'Windows' | 'Linux' | 'Android' | 'Bare-metal';

export interface Device {
  id: string;
  name: string;
  model: string;
  type: DeviceType;
  interface: string;
  capacity: string;
  capacityGB: number;
  usedGB: number;
  health: number;
  status: DeviceStatus;
  platform: Platform;
  serial: string;
  firmware: string;
  hasHPA: boolean;
  hasDCO: boolean;
  lastSeen: string;
  erased?: boolean;
  recovered?: boolean;
}

export interface Certificate {
  id: string;
  type: 'wipe' | 'recovery' | 'non-recoverable';
  deviceId: string;
  deviceName: string;
  timestamp: string;
  method: string;
  standard: string;
  hash: string;
  previousHash: string;
  blockIndex: number;
  operator: string;
  status: 'verified' | 'pending' | 'failed';
  signature: string;
  filesRecovered?: number;
  successRate?: number;
}

export interface RecoveryFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'spreadsheet';
  size: string;
  sizeBytes: number;
  recoveredAt: string;
  confidence: number;
  originalPath: string;
  extension: string;
  thumbnail?: string;
}

export const DEVICES: Device[] = [
  {
    id: 'dev-001',
    name: 'SEAGATE BARRACUDA 2TB',
    model: 'ST2000DM008',
    type: 'HDD',
    interface: 'SATA III',
    capacity: '2 TB',
    capacityGB: 2000,
    usedGB: 1340,
    health: 91,
    status: 'healthy',
    platform: 'Windows',
    serial: 'WFL05ZG4',
    firmware: 'CC26',
    hasHPA: true,
    hasDCO: false,
    lastSeen: '2026-09-18T08:42:00Z',
  },
  {
    id: 'dev-002',
    name: 'SAMSUNG 970 EVO PLUS',
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
    lastSeen: '2026-09-18T09:15:00Z',
  },
  {
    id: 'dev-003',
    name: 'KINGSTON DT 100G3',
    model: 'DTSE9G2/64GB',
    type: 'USB',
    interface: 'USB 3.0',
    capacity: '64 GB',
    capacityGB: 64,
    usedGB: 51,
    health: 72,
    status: 'warning',
    platform: 'Windows',
    serial: 'A01B2C3D4E5F',
    firmware: 'PMAP',
    hasHPA: false,
    hasDCO: true,
    lastSeen: '2026-09-17T22:00:00Z',
  },
  {
    id: 'dev-004',
    name: 'WD BLUE SSD 1TB',
    model: 'WDS100T2B0A',
    type: 'SSD',
    interface: 'SATA III',
    capacity: '1 TB',
    capacityGB: 1000,
    usedGB: 670,
    health: 85,
    status: 'warning',
    platform: 'Windows',
    serial: '195498810098',
    firmware: 'X61190WD',
    hasHPA: true,
    hasDCO: true,
    lastSeen: '2026-09-18T07:30:00Z',
  },
  {
    id: 'dev-005',
    name: 'TOSHIBA MQ04ABF100',
    model: 'MQ04ABF100',
    type: 'HDD',
    interface: 'SATA III',
    capacity: '1 TB',
    capacityGB: 1000,
    usedGB: 0,
    health: 12,
    status: 'physical_damage',
    platform: 'Bare-metal',
    serial: 'Z9A0B1C2D3',
    firmware: 'JU000C',
    hasHPA: false,
    hasDCO: false,
    lastSeen: '2026-09-16T14:00:00Z',
  },
  {
    id: 'dev-006',
    name: 'CRUCIAL P3 PLUS 2TB',
    model: 'CT2000P3PSSD8',
    type: 'NVMe',
    interface: 'PCIe 4.0 x4',
    capacity: '2 TB',
    capacityGB: 2000,
    usedGB: 890,
    health: 94,
    status: 'healthy',
    platform: 'Linux',
    serial: '2310E6A6B7C8',
    firmware: 'P9CR40A',
    hasHPA: false,
    hasDCO: false,
    lastSeen: '2026-09-18T10:00:00Z',
    erased: true,
  },
];

const makeHash = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

const genHash = (seed: string) =>
  `${makeHash(seed + '1')}${makeHash(seed + '2')}${makeHash(seed + '3')}${makeHash(seed + '4')}${makeHash(seed + '5')}${makeHash(seed + '6')}${makeHash(seed + '7')}${makeHash(seed + '8')}`;

export const CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    type: 'wipe',
    deviceId: 'dev-006',
    deviceName: 'CRUCIAL P3 PLUS 2TB',
    timestamp: '2026-09-17T14:32:11Z',
    method: 'ATA Secure Erase (Enhanced) + 3-Pass DoD 5220.22-M',
    standard: 'NIST SP 800-88 Rev.2',
    hash: genHash('cert-001'),
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    blockIndex: 0,
    operator: 'Arjun Mehta (Forensic Auditor)',
    status: 'verified',
    signature: `MEQCIHkX9vLmR2nQpT7bY3cF6wK1dJ8sA4eZ0gN5hM2oP9rE\nAiA3TuV8wX6yZ4nS1kR9mB7cL2aP5eQ0dF3hN8gM4oJ7s==`,
  },
  {
    id: 'cert-002',
    type: 'recovery',
    deviceId: 'dev-001',
    deviceName: 'SEAGATE BARRACUDA 2TB',
    timestamp: '2026-09-16T09:18:44Z',
    method: 'Deep Forensic Scan + File Carving (Signature + Journal)',
    standard: 'ISO/IEC 27040:2024',
    hash: genHash('cert-002'),
    previousHash: genHash('cert-001'),
    blockIndex: 1,
    operator: 'Atharv (Enterprise Admin)',
    status: 'verified',
    signature: `MEUCIQDpN7rK3sL9tQ2vA8mB4cE6wF1xY5hG0jM2nP3oR7e\nAiBkT9uV4wX8yZ2nS6kR1mB5cL3aP7eQ4dF0hN2gM6oJ9s==`,
    filesRecovered: 1847,
    successRate: 94.2,
  },
  {
    id: 'cert-003',
    type: 'non-recoverable',
    deviceId: 'dev-005',
    deviceName: 'TOSHIBA MQ04ABF100',
    timestamp: '2026-09-16T16:55:22Z',
    method: 'Physical Damage Assessment — Platter Failure Detected',
    standard: 'IEEE 2883-2022',
    hash: genHash('cert-003'),
    previousHash: genHash('cert-002'),
    blockIndex: 2,
    operator: 'Arjun Mehta (Forensic Auditor)',
    status: 'verified',
    signature: `MEQCIGxY2vLmR9nQpT4bA8cF3wK7dJ1sB6eZ5gN0hM9oP2r\nAiA8TuV3wX1yZ7nS4kR6mB2cL9aP0eQ7dF4hN1gM3oJ6s==`,
  },
];

export const MOCK_RECOVERY_FILES: RecoveryFile[] = [
  { id: 'rf-001', name: 'Annual_Report_2025.pdf', type: 'document', size: '4.2 MB', sizeBytes: 4404019, recoveredAt: '', confidence: 97, originalPath: 'C:\\Users\\Documents\\', extension: 'pdf' },
  { id: 'rf-002', name: 'IMG_20250814_102347.jpg', type: 'image', size: '3.8 MB', sizeBytes: 3984588, recoveredAt: '', confidence: 99, originalPath: 'C:\\Users\\Pictures\\Camera Roll\\', extension: 'jpg' },
  { id: 'rf-003', name: 'budget_q3_2025.xlsx', type: 'spreadsheet', size: '1.1 MB', sizeBytes: 1153433, recoveredAt: '', confidence: 94, originalPath: 'C:\\Users\\Documents\\Finance\\', extension: 'xlsx' },
  { id: 'rf-004', name: 'project_backup_v4.zip', type: 'archive', size: '128 MB', sizeBytes: 134217728, recoveredAt: '', confidence: 88, originalPath: 'D:\\Backups\\', extension: 'zip' },
  { id: 'rf-005', name: 'client_presentation.pptx', type: 'document', size: '22 MB', sizeBytes: 23068672, recoveredAt: '', confidence: 96, originalPath: 'C:\\Users\\Documents\\Presentations\\', extension: 'pptx' },
  { id: 'rf-006', name: 'meeting_recording_sep12.mp4', type: 'video', size: '340 MB', sizeBytes: 356515840, recoveredAt: '', confidence: 91, originalPath: 'C:\\Users\\Videos\\Meetings\\', extension: 'mp4' },
  { id: 'rf-007', name: 'contract_draft_v2.docx', type: 'document', size: '890 KB', sizeBytes: 911872, recoveredAt: '', confidence: 98, originalPath: 'C:\\Users\\Documents\\Legal\\', extension: 'docx' },
  { id: 'rf-008', name: 'photo_backup_aug2025.jpg', type: 'image', size: '5.7 MB', sizeBytes: 5978931, recoveredAt: '', confidence: 99, originalPath: 'D:\\Photos\\2025\\', extension: 'jpg' },
  { id: 'rf-009', name: 'database_export_20250901.sql', type: 'document', size: '67 MB', sizeBytes: 70254592, recoveredAt: '', confidence: 85, originalPath: 'C:\\Projects\\DB\\', extension: 'sql' },
  { id: 'rf-010', name: 'voice_memo_0038.m4a', type: 'audio', size: '14 MB', sizeBytes: 14680064, recoveredAt: '', confidence: 93, originalPath: 'C:\\Users\\Music\\Memos\\', extension: 'm4a' },
  { id: 'rf-011', name: 'taxes_2024_final.pdf', type: 'document', size: '2.1 MB', sizeBytes: 2202010, recoveredAt: '', confidence: 97, originalPath: 'C:\\Users\\Documents\\Tax\\', extension: 'pdf' },
  { id: 'rf-012', name: 'product_demo_v3.mp4', type: 'video', size: '512 MB', sizeBytes: 536870912, recoveredAt: '', confidence: 89, originalPath: 'D:\\Projects\\Demo\\', extension: 'mp4' },
];

export const ERASE_LOG_LINES = [
  '[INIT]    VoidSeek Erasure Engine v3.1.2 — starting session',
  '[INFO]    Target device: {device}',
  '[INFO]    Interface: {interface} | Firmware: {firmware}',
  '[DETECT]  HPA (Host Protected Area): {hpa}',
  '[DETECT]  DCO (Device Configuration Overlay): {dco}',
  '[STEP 1]  Disabling HPA — sending SET MAX ADDRESS EXT command…',
  '[OK]      HPA restored — full LBA range accessible',
  '[STEP 2]  Disabling DCO — sending DEVICE CONFIGURATION RESET command…',
  '[OK]      DCO cleared — native max address confirmed',
  '[STEP 3]  Issuing ATA SECURITY ERASE UNIT (Enhanced mode)…',
  '[INFO]    Estimated firmware erase time: 18 min',
  '[PROG]    Secure erase in progress — polling drive status…',
  '[STEP 4]  Firmware erase complete — verifying with pattern overwrite',
  '[WRITE]   Pass 1/3 — writing 0x00 pattern across all sectors…',
  '[WRITE]   Pass 2/3 — writing 0xFF pattern across all sectors…',
  '[WRITE]   Pass 3/3 — writing pseudorandom pattern (CSPRNG seeded)…',
  '[VERIFY]  Running post-wipe forensic scan — mounting read-only…',
  '[ENTROPY] Calculating sector entropy — expected ~7.99 bits/byte…',
  '[SCAN]    Attempting file signature recovery (0 signatures found)…',
  '[SCAN]    Attempting metadata journal recovery (0 entries found)…',
  '[DONE]    Erasure verified — no recoverable data detected',
  '[CERT]    Generating tamper-evident certificate…',
  '[SIGN]    Applying ECDSA-P256 digital signature…',
  '[CHAIN]   Anchoring to Merkle certificate chain (block #{block})…',
  '[OK]      Certificate issued — hash: {hash}',
];

export const SCAN_LOG_LINES = [
  '[INIT]    VoidSeek Recovery Engine v3.1.2 — mounting device read-only',
  '[INFO]    Target: {device} ({capacity})',
  '[STEP 1]  Parsing partition table (GPT/MBR detection)…',
  '[FOUND]   Partition: NTFS — 931.5 GiB at LBA 2048',
  '[STEP 2]  Reading filesystem journal for deleted entry metadata…',
  '[JOURNAL] 2,341 journal entries scanned — 847 deletion events found',
  '[STEP 3]  Running deep file-signature carving scan…',
  '[CARVE]   Scanning at 512-byte sector resolution…',
  '[FOUND]   JPEG signature detected at sector 0x00A4F200',
  '[FOUND]   PDF header detected at sector 0x01C8E400',
  '[FOUND]   ZIP/OOXML structure detected at sector 0x03D1A800',
  '[FOUND]   MP4 ftyp box detected at sector 0x08F44C00',
  '[STEP 4]  Cross-referencing MFT records with carved file signatures…',
  '[MATCH]   1,847 files matched with high confidence (≥85%)',
  '[STEP 5]  Computing per-file recovery confidence scores…',
  '[DONE]    Scan complete — {count} recoverable files found',
];
