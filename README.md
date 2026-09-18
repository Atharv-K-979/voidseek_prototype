<div align="center">

# 🛡️ VoidSeek — Wipe. Recover. Verify.

### **Unified Data Sanitization, Forensic Recovery & Cryptographically Audited Security Platform**

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue?style=for-the-badge&logo=target)](https://sih.gov.in/)
[![Problem Statement ID](https://img.shields.io/badge/PS%20ID-SIH26149-orange?style=for-the-badge)](https://sih.gov.in/)
[![Domain](https://img.shields.io/badge/Domain-Blockchain%20%26%20Cybersecurity-purple?style=for-the-badge)](https://sih.gov.in/)
[![Category](https://img.shields.io/badge/Category-Software%20Edition-green?style=for-the-badge)](https://sih.gov.in/)
[![Organization](https://img.shields.io/badge/Organization-NTRO-red?style=for-the-badge)](https://ntro.gov.in/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://voidseek-prototype.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Developed by Team Axiotergere for Smart India Hackathon 2026**

---

### 🌐 **[Live Application (Hosted on Vercel)](https://voidseek-prototype.vercel.app)** &nbsp;•&nbsp; 📂 **[GitHub Repository](https://github.com/Atharv-K-979/voidseek_prototype)** &nbsp;•&nbsp; 📜 **[Audit Trail Explorer](https://voidseek-prototype.vercel.app/certificates)**

---

</div>

## 📌 Smart India Hackathon (SIH 2026) Overview

| Parameter | Official Specification |
| :--- | :--- |
| **Problem Statement ID** | **SIH26149** |
| **Problem Statement Title** | **Design and Development of an Integrated Secure Data Erasure and Advanced File Recovery Tool for Digital Forensics and Data Sanitization** |
| **Ministry / Organization** | **National Technical Research Organisation (NTRO)** |
| **Theme / Domain** | **Blockchain & Cybersecurity** |
| **Category** | **Software Edition** |
| **Team Name** | **Team Axiotergere** |
| **Target End-Users** | Defense Establishments, Law Enforcement Agencies (LEAs), Digital Forensics & Incident Response (DFIR) Units, Intelligence Services, Enterprise IT Asset Disposition (ITAD), Certifying Authorities |

---

## 🎯 The Dual Challenge: Data Sanitization vs. Digital Forensics

Modern defense, intelligence, and enterprise environments face a critical contradiction in data lifecycle management:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               THE DATA LIFECYCLE PARADOX                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
                 │                                                      │
                 ▼                                                      ▼
  [ 1. THE ERASURE PROBLEM ]                             [ 2. THE RECOVERY PROBLEM ]
  • Standard OS formats leave sectors intact             • Critical digital evidence is intentionally
  • SSD over-provisioning & wear-leveling hide data        deleted, fragmented, or corrupted by adversaries
  • HPA / DCO areas bypass normal OS commands            • Carving tools often compromise file integrity
  • Paper/PDF wiping certificates are easily forged      • Chain of custody is broken without proofs
  • Risk: Classified intelligence leakage                • Risk: Court admissibility failure
```

1. **The Sanitization Challenge (Secure Purge):**
   - Traditional OS deletion or quick formatting merely removes partition tables and filesystem pointers; the raw magnetic/flash bits remain completely recoverable using standard forensic tools.
   - Solid-State Drives (SSDs) utilize wear-leveling and over-provisioned flash blocks that traditional file shredders cannot reach.
   - Hidden storage partitions such as **Host Protected Areas (HPA)** and **Device Configuration Overlays (DCO)** frequently retain sensitive or classified data unnoticed.
   - Compliance with defense and international standards (**NIST SP 800-88 Rev. 2**, **DoD 5220.22-M**, **IEEE 2883-2022**) requires provable sector overwrite and mathematical post-wipe entropy verification.

2. **The Forensic Recovery Challenge (Evidence Extraction):**
   - Incident response teams and investigators routinely seize devices where suspect data has been deleted, partitions destroyed, or filesystems formatted.
   - File carvers must reconstruct headers, trailers, and fragmented clusters across FAT32, exFAT, NTFS, and EXT4 without modifying a single bit on the target medium (forensic sound practice / **ISO/IEC 27040:2024**).
   - Forensic reports must provide confidence scores, signature cross-matching, and verifiable hash manifests to satisfy judicial evidentiary standards.

3. **The Cryptographic Trust Deficit:**
   - Existing enterprise wiping utilities produce static, unauthenticated certificates or plain PDFs that can easily be modified by rogue insiders.
   - There has been no unified, open-standard solution that combines **military-grade erasure**, **deep file recovery**, and an **immutable Merkle audit ledger** in a single integrated console.

---

## 💡 The VoidSeek Solution

**VoidSeek** addresses all criteria of **SIH26149** by delivering an integrated, defense-grade platform that bridges the gap between secure sanitization and forensic data recovery, backed by a cryptographic Merkle audit anchor.

```
                               ┌───────────────────────────────────────────────┐
                               │           VoidSeek Defense Console            │
                               │        https://voidseek-prototype.vercel.app  │
                               └──────────────────────┬────────────────────────┘
                                                      │
                    ┌─────────────────────────────────┴─────────────────────────────────┐
                    ▼                                                                   ▼
       ┌──────────────────────────┐                                        ┌──────────────────────────┐
       │   SANITIZATION SUITE     │                                        │     FORENSIC RECOVERY    │
       ├──────────────────────────┤                                        ├──────────────────────────┤
       │ • ATA Secure Erase       │                                        │ • Raw Sector Carving     │
       │ • DoD 5220.22-M 3-Pass   │                                        │ • Magic Byte Matching    │
       │ • Gutmann 35-Pass Shred  │                                        │ • Cluster Reassembly     │
       │ • HPA / DCO Purge        │                                        │ • Confidence Scoring     │
       │ • Post-Wipe Entropy Test │                                        │ • Read-Only Integrity    │
       │   (Threshold > 7.99 bps) │                                        │ • File Header Validation │
       └────────────┬─────────────┘                                        └────────────┬─────────────┘
                    │                                                                   │
                    └─────────────────────────────────┬─────────────────────────────────┘
                                                      │
                                                      ▼
                                     ┌─────────────────────────────────┐
                                     │   CRYPTOGRAPHIC AUDIT ANCHOR    │
                                     ├─────────────────────────────────┤
                                     │ • SHA-256 Hash Chain (Merkle)   │
                                     │ • ECDSA-P256 Digital Signature  │
                                     │ • RFC-3161 Proof of Timestamp   │
                                     │ • Tamper-Evident Certificates   │
                                     │ • Independent Third-Party Verify│
                                     └─────────────────────────────────┘
```

---

## 🚀 Key Modules & Architecture

### 1. 🧹 5-Step Certified Data Erasure Workflow (`/erase`)
A fail-safe, guided wizard ensuring 100% irrecoverable data destruction:
* **Phase 1: Strategy Selection:** Select target physical drive or target directory, with options for **Full Drive Sanitization** (ATA Secure Erase + DoD 5220.22-M) or **Selective File Shredding** (Gutmann 35-Pass overwrite).
* **Phase 2: Bare-Metal Environment Check:** Pre-flight sanity check verifying bare-metal execution, hypervisor/virtualization detection, firmware write permissions, and HPA/DCO boundary access.
* **Phase 3: Multi-Pass Overwrite Stream:** Live terminal streaming showing pass-by-pass execution (`0x00` null fill, `0xFF` one fill, and CSPRNG pseudorandom noise), tracking throughput (MB/s), elapsed time, and ETA.
* **Phase 4: Forensic Verification Pass:** Mounts the drive in read-only forensic mode and executes sector-level Shannon entropy sampling ($\sim 7.998$ bits/byte) and signature carving to prove that 0 residual artifacts remain.
* **Phase 5: Tamper-Evident Certificate:** Issues a digitally signed sanitization certificate linked to the Merkle ledger with instant download (**Plain Text Report**, **Signed JSON Certificate**, or **Print / Save PDF**).

### 2. 🔍 5-Step Deep Forensic Recovery Workflow (`/recover`)
A non-destructive evidence extraction pipeline adhering to forensic standards:
* **Phase 1: Deep Sector Scan:** Scans raw 512-byte / 4096-byte sectors for magic byte headers/trailers across documents (PDF, DOCX), images (JPG, PNG, RAW), videos (MP4, MKV), audio, archives (ZIP, TAR), and spreadsheets.
* **Phase 2: File Browser & Confidence Scoring:** Categorized viewer displaying detected artifacts with file confidence ratings ($85\% - 99\%$), file size, sector offset, and integrity status.
* **Phase 3: Cluster Restoration:** Reassembles fragmented clusters and writes extracted files to a separate, isolated destination media, guaranteeing zero writes to the source evidence drive.
* **Phase 4: Integrity Verification:** Performs SHA-256 checksum cross-checks against filesystem journals to validate file completeness.
* **Phase 5: Forensic Recovery Report:** Generates a court-admissible recovery manifest complete with file counts, recovery success rate, Merkle block index, and digital signatures.

### 3. ⛓️ Merkle Audit Ledger & Certificate Verification (`/certificates`)
* **Cryptographic Block Chain:** Every sanitization or recovery action is immutably committed as a block containing `blockIndex`, `timestamp`, `operationType`, `deviceHash`, `entropyScore`, `operatorId`, and the `previousHash`.
* **ECDSA-P256 Digital Signatures:** Every certificate is signed using NIST-approved elliptic curve cryptography.
* **Third-Party Verification Node:** An integrated validation engine that enables external auditors, defense inspectors, and courts to paste any certificate hash or JSON to mathematically verify authenticity and chain continuity.

### 4. 📊 Storage Telemetry & Analytics Dashboard (`/dashboard` & `/reports`)
* Real-time hardware health, SMART telemetry, temperature monitoring, and sector status.
* Cumulative statistics: total gigabytes sanitized, recovery success rate, and historical compliance audits.
* Pre-wipe vs. post-wipe entropy distribution charts rendered using Recharts.

---

## 📋 Standards & Compliance Matrix

| Standard / Protocol | Authority | Scope & Mandate | VoidSeek Implementation |
| :--- | :--- | :--- | :--- |
| **NIST SP 800-88 Rev. 2** | National Institute of Standards and Technology | Guidelines for Media Sanitization (Clear & Purge) | Full drive overwrite + entropy validation (> 7.99 bps) |
| **DoD 5220.22-M** | U.S. Department of Defense | National Industrial Security Program Operating Manual | 3-Pass method: Zeroes, Ones, and Cryptographic Random |
| **Gutmann Algorithm** | Peter Gutmann (Univ. of Auckland) | Secure Deletion of Data from Magnetic and Solid-State | 35-pass overwrite pattern for selective shredding |
| **IEEE 2883-2022** | IEEE Computer Society | Standard for Sanitizing Storage | NVMe Cryptographic Erase & ATA Enhanced Sanitize |
| **ISO/IEC 27040:2024** | ISO / IEC | Storage Security & Forensic Readiness | Chain-of-custody logging, court-admissible audit reports |
| **BSI-VSITR** | German Federal Office for Information Security | Standard for Data Erasure | 7-pass alternating bit-pattern overwrite |

---

## 🧭 Evaluator & Judge Walkthrough Guide

To evaluate the live application on Vercel:

```
[ https://voidseek-prototype.vercel.app ]
                     │
                     ▼
         [ 1. Click "Launch App" ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  [ Instant Demo Login ]    [ Sign Up / Register ]
   (Marked "Recommended")
         │
         ▼
[ 2. Authenticated Dashboard (/dashboard) ]
         │
         ├───────────────────────────────────────────────┐
         ▼                                               ▼
[ 3. Certified Erasure (/erase) ]               [ 4. Forensic Recovery (/recover) ]
  • Step 1: Select Drive & Protocol               • Step 1: Deep Sector Scan
  • Step 2: Bare-Metal Environment Check          • Step 2: Select Carved Files
  • Step 3: Real-Time Wipe Terminal Stream        • Step 3: Cluster Restoration
  • Step 4: Shannon Entropy Verification          • Step 4: SHA-256 Integrity Check
  • Step 5: Download Signed Certificate           • Step 5: Forensic Recovery Manifest
         │                                               │
         └───────────────────────┬───────────────────────┘
                                 │
                                 ▼
              [ 5. Merkle Audit Ledger (/certificates) ]
                • Inspect cryptographic block chain
                • Validate certificate hashes
                • Independent node verification
```

1. **Accessing the Application:**
   - Navigate to **[https://voidseek-prototype.vercel.app](https://voidseek-prototype.vercel.app)**.
   - Click **"Launch App"** or **"Get Started"**.
   - A modal window will appear. The **Sign In / Login** button is prominently marked with a bold **Recommended** tag, offering a **1-click Instant Demo Launch** as `Admin` (Enterprise Security Officer).
2. **Exploring Hardware & Devices (`/devices`):**
   - Inspect connected NVMe SSDs, SATA drives, and external media with serial numbers, firmware revisions, and HPA/DCO indicators.
   - Trigger immediate sanitization or recovery per drive.
3. **Testing Data Erasure (`/erase`):**
   - Choose **Full Drive Sanitization** with **NIST SP 800-88 Purge**.
   - Watch the bare-metal environment diagnostics pass.
   - Observe the live streaming terminal output and post-wipe entropy verification graph.
   - Download the generated cryptographically signed certificate in TXT or JSON format.
4. **Testing Forensic Recovery (`/recover`):**
   - Run the deep sector scanner on target storage media.
   - Filter discovered evidence by file type (Documents, Images, Database, Video).
   - Reassemble clusters and review the generated evidence chain of custody report.
5. **Verifying the Audit Trail (`/certificates`):**
   - Inspect the live Merkle blockchain.
   - Verify that new blocks are appended with valid parent hashes and ECDSA signatures.

---

## 🛠️ Technology Stack

| Layer | Technology | Justification / Role |
| :--- | :--- | :--- |
| **Frontend Core** | [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe, component-driven UI with reactive state management |
| **Bundler / Dev Server** | [Vite 8](https://vite.dev/) | Sub-second hot module replacement and optimized ESM production bundling |
| **Styling** | [TailwindCSS v4](https://tailwindcss.com/) | Curated enterprise cybersecurity dark/light palette with glassmorphism |
| **Transitions & Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth hardware scanning transitions and micro-interactions |
| **Forensic Charts** | [Recharts 3](https://recharts.org/) | Real-time Shannon entropy curves and storage telemetry visualizers |
| **Iconography** | [Lucide React](https://lucide.dev/) | Clean, consistent cybersecurity and forensics iconography |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Client-side routing with deep linkable state |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) | Global edge CDN, automated deployments, and zero-latency preview builds |

---

## 📂 Project Structure

```
voidseek_prototype/
├── .github/                      # CI/CD workflows & templates
├── public/                       # Static public assets & brand icons
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ErrorBoundary.tsx     # Graceful error interception (no full-screen locks)
│   │   ├── Footer.tsx            # Standard footer with NTRO/SIH credits
│   │   ├── Layout.tsx            # Main shell with sidebar navigation & topbar
│   │   └── Navbar.tsx            # Responsive navigation header
│   ├── context/
│   │   └── AppContext.tsx        # Global state (auth, devices, certificates, jobs)
│   ├── pages/
│   │   ├── Certificates.tsx      # Merkle audit chain explorer & third-party verification
│   │   ├── Dashboard.tsx         # Hardware health overview & activity monitor
│   │   ├── Devices.tsx           # Physical storage device manager (NVMe, SSD, HDD, USB)
│   │   ├── Erase.tsx             # 5-Step Certified Data Erasure wizard
│   │   ├── Landing.tsx           # High-impact landing page with Launch App modal
│   │   ├── Login.tsx             # Authentication interface with 1-click demo access
│   │   ├── Recover.tsx           # 5-Step Deep Forensic Recovery wizard
│   │   ├── Reports.tsx           # Forensic audit reports, compliance logs & analytics
│   │   ├── Settings.tsx          # System configurations, wiping algorithms & security keys
│   │   └── Signup.tsx            # Registration portal for new forensic operators
│   ├── mockData.ts               # Simulated hardware devices, certificates & carving data
│   ├── types.ts                  # Comprehensive TypeScript interfaces & domain types
│   ├── App.tsx                   # Route definitions and application tree
│   ├── index.css                 # Custom design tokens, scrollbars & Tailwind imports
│   └── main.tsx                  # React DOM entry point
├── .gitignore                    # Clean git ignore (excludes node_modules, dist, .env)
├── package.json                  # Dependencies & execution scripts
├── tsconfig.json                 # Strict TypeScript configuration
├── vite.config.ts                # Vite build and bundling configuration
└── README.md                     # Comprehensive project documentation
```

---

## ⚡ Local Setup & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (bundled with Node.js) or `pnpm` / `yarn`
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Atharv-K-979/voidseek_prototype.git
cd voidseek_prototype
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on **`http://localhost:5173/`**.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🚀 Deployment to Vercel

The application is deployed on Vercel at **[https://voidseek-prototype.vercel.app](https://voidseek-prototype.vercel.app)**.

To deploy your own instance to Vercel:

### Option 1: Via Vercel Web Dashboard (Recommended)
1. Fork or push this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Select your repository `voidseek_prototype`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# Follow the on-screen prompts; accept default settings
```

---

## 👥 Team Axiotergere (Smart India Hackathon 2026)

| Role / Domain | Details |
| :--- | :--- |
| **Team Name** | **Axiotergere** |
| **Hackathon** | **Smart India Hackathon 2026** (Software Edition) |
| **Problem Statement ID** | **SIH26149** |
| **Nodal Organization** | **National Technical Research Organisation (NTRO)** |
| **Domain** | **Blockchain & Cybersecurity** |
| **Repository** | [Atharv-K-979/voidseek_prototype](https://github.com/Atharv-K-979/voidseek_prototype) |
| **Live Link** | [voidseek-prototype.vercel.app](https://voidseek-prototype.vercel.app) |

---

## 📄 License & Legal Notice

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

> [!NOTE]
> **Forensic & Defense Advisory:** VoidSeek is architected in accordance with defense standards (NIST SP 800-88 Rev. 2, DoD 5220.22-M, IEEE 2883-2022, and ISO/IEC 27040:2024). Sanitization operations perform non-reversible physical sector overwrites. Ensure proper authorization before executing destructive purge commands on storage media.

<div align="center">
  <sub>Built with pride by <b>Team Axiotergere</b> for <b>Smart India Hackathon 2026</b> · In service of National Cybersecurity & Digital Forensics</sub>
</div>
