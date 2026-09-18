# VoidSeek — Wipe. Recover. Verify.

**Enterprise Data Sanitization, Forensic Recovery & Cryptographic Verification Platform**


## Local Development

```bash
pnpm install
pnpm dev          # starts Vite dev server on :5173
```

## Production Build

```bash
pnpm build        # outputs to dist/
pnpm preview      # preview the dist/ build locally
```

## Deploy to Vercel

```bash
vercel            # auto-detects Vite, deploys dist/
```

Or drag-and-drop the `dist/` folder to Netlify.

## Demo Walkthrough

1. **/** — Landing page (features, comparison table, compliance badges)
2. **/signup** — Create an account, choose role (Individual / Enterprise Admin / Forensic Auditor)
3. **/dashboard** — Overview of connected devices + recent certificates
4. **/devices** → **Erase** → 5-step wizard: path selection → VM check → live erasure log → forensic verification → Merkle-linked certificate
5. **/devices** → **Recover** → scan → file selection → restore → verify → recovery report
6. **/certificates** — Full audit log with Merkle chain visualization and third-party verification
7. **/reports** — Impact dashboard with recharts
8. **/settings** — Compliance standard selector, notifications, API keys

All state is persisted to localStorage — refreshing mid-demo preserves progress.
