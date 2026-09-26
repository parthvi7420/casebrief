# CaseBrief — 2-Person Team Setup

**Digital Fraud Evidence Reconstruction**

A 2-hour collaborative build for an investigation desk application that takes unorganized fraud evidence and produces a structured incident report with timeline, gaps, contradictions, and redaction.

---

## Team Structure

This repository is designed for **exactly 2 team members** working in parallel with **zero file conflicts**.

| Role | Member | Primary Folders | Time to First Commit |
|---|---|---|---|
| **Member 1: Frontend/UI** | Person A | `src/components/`, `src/pages/`, `src/styles/` | 10 min |
| **Member 2: Investigation Engine** | Person B | `src/extract/`, `src/modules/`, `src/logic/`, `src/store/`, `src/utils/`, `public/demo/` | 10 min |
| **Shared** | Both | `src/types/incident.ts` (agreed once, then frozen) | — |

---

## Folder Ownership

```
casebrief/
│
├── public/
│   └── demo/                          ← MEMBER 2
│       ├── phishing_message.txt
│       ├── suspicious_url.txt
│       └── transactions.csv
│
├── src/
│   ├── components/                    ← MEMBER 1 ONLY
│   │   ├── ProcessStepper.tsx
│   │   ├── ModuleRail.tsx
│   │   ├── EvidencePanel.tsx
│   │   ├── ExtractionPanel.tsx
│   │   ├── PhishingTimeline.tsx
│   │   ├── MissingPanel.tsx
│   │   ├── ConflictPanel.tsx
│   │   ├── RedactionPanel.tsx
│   │   └── IncidentReport.tsx
│   │
│   ├── pages/                         ← MEMBER 1 ONLY
│   │   └── InvestigationDesk.tsx
│   │
│   ├── styles/                        ← MEMBER 1 ONLY
│   │   └── index.css
│   │
│   ├── types/                         ← SHARED (frozen after agreement)
│   │   └── incident.ts
│   │
│   ├── extract/                       ← MEMBER 2 ONLY
│   │   ├── dates.ts
│   │   ├── money.ts
│   │   ├── urls.ts
│   │   ├── payments.ts
│   │   ├── whatsapp.ts
│   │   └── index.ts
│   │
│   ├── modules/                       ← MEMBER 2 ONLY
│   │   ├── message.ts
│   │   ├── url.ts
│   │   ├── network.ts
│   │   ├── intel.ts
│   │   ├── transaction.ts
│   │   └── fraudLog.ts
│   │
│   ├── logic/                         ← MEMBER 2 ONLY
│   │   ├── timeline.ts
│   │   ├── gaps.ts
│   │   ├── conflicts.ts
│   │   ├── redaction.ts
│   │   └── incident.ts
│   │
│   ├── store/                         ← MEMBER 2 ONLY
│   │   └── caseStore.ts
│   │
│   ├── utils/                         ← MEMBER 2 ONLY
│   │   ├── hashing.ts
│   │   └── export.ts
│   │
│   ├── App.tsx                        ← SHARED (integration only)
│   └── main.tsx
│
├── README.md                          ← MEMBER 1
├── gp.md                              ← MEMBER 1
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── ...
```

---

## The Shared Contract

**Do not modify `src/types/incident.ts` after you agree on it.**

Both members must agree on:

```typescript
interface Incident {
  id: string
  createdAt: string
  caseNumber: string
  summary: { title, fraudType, estimatedLoss, currency }
  parties: Party[]
  channels: Channel[]
  transactions: Transaction[]
  timeline: TimelineEvent[]
  gaps: Gap[]
  conflicts: Conflict[]
  moduleHits: ModuleHit[]
  fraudAttemptLog: FraudAttempt[]
  evidence: EvidenceItem[]
  redacted?: { phone, email, upi, account, aadhaar, pan }
}
```

**Member 2 exposes:**
- `loadDemoCase(): Incident`
- `processEvidence(evidence: EvidenceItem[]): Promise<Incident>`

**Member 1 calls these and renders the result.**

---

## Timeline: 0–120 Minutes

### 0–10 Minutes: Setup
- [ ] Clone repo locally
- [ ] `npm install`
- [ ] **Both agree on `Incident` schema** (freeze it in `src/types/incident.ts`)
- [ ] **Create branches:**
  - Member 1: `git checkout -b feature/frontend-investigation-desk`
  - Member 2: `git checkout -b feature/investigation-engine`

### 10–60 Minutes: Independent Work

**Member 1 builds:**
- ProcessStepper (7 steps)
- ModuleRail (6 modules)
- EvidencePanel (drag, paste, add URL)
- ExtractionPanel (entities grouped by type)
- PhishingTimeline (exact 4-event story)

**Member 2 builds:**
- Demo data files
- Extraction engine (dates, money, URLs, UPI, etc.)
- Six security modules
- Timeline logic
- Gap & conflict detection

*No merges yet. Work independently.*

### 60–90 Minutes: Continue

**Member 1:**
- MissingPanel
- ConflictPanel
- RedactionPanel
- IncidentReport

**Member 2:**
- Redaction engine
- SHA-256 hashing
- IndexedDB persistence
- JSON export (shareable + full local)

### 90 Minutes: Integration Point

**Member 2 pushes:** `git push -u origin feature/investigation-engine`

**Member 1 pulls:** `git pull origin main` (merges Member 2's code)

**Member 1 connects:**
```typescript
import { loadDemoCase } from '../logic/incident'

const incident = loadDemoCase()
setIncident(incident)
```

### 90–105 Minutes: Integration Testing

- [ ] Load demo loads without errors
- [ ] Timeline shows 4 events
- [ ] Module rail shows 6 modules
- [ ] Missing panel shows "UTR"
- [ ] Conflict panel shows "₹5,000 vs ₹4,999"
- [ ] Redaction toggle works
- [ ] Export produces JSON

### 105–120 Minutes: Demo Hardening

```bash
1. npm install
2. npm run dev
3. Click "Load Demo"
4. Verify all 10 steps work
5. Screenshot for judges
```

---

## Git Workflow

### Create development branches

```bash
# Member 1
git checkout -b feature/frontend-investigation-desk

# Member 2
git checkout -b feature/investigation-engine
```

### Commit frequently (but separately)

**Member 1 commits:**
```bash
git add src/components/ src/pages/ src/styles/
git commit -m "feat(ui): add investigation desk layout

- ProcessStepper with 7 steps
- ModuleRail with 6 security modules
- Evidence, extraction, and timeline panels"
```

**Member 2 commits:**
```bash
git add src/extract/ src/modules/ src/logic/ public/demo/
git commit -m "feat(core): add investigation engine

- Deterministic extraction (dates, money, UPI, URLs)
- Six security module implementations
- Timeline and conflict detection logic"
```

### At 90-minute integration point

**Member 2:**
```bash
git push -u origin feature/investigation-engine
```

**Member 1:**
```bash
git pull origin main
# Then integrate the loadDemoCase() call
```

### Final PR

```bash
# After everything works:
git push -u origin feature/frontend-investigation-desk
```

Then create PR on GitHub:
- Title: `feat: complete casebrief investigation desk`
- Description: List what works, what's tested, any limitations

---

## Demo Requirements (Must Work)

At 120 minutes, demonstrate this exact sequence:

```
1. npm install
2. npm run dev
3. Browser opens to localhost:5173
4. Click "LOAD DEMO"
5. Stepper shows 7 steps
6. Timeline shows these exact events:
   - 10:34 → Suspicious Message Received
   - 10:35 → Suspicious URL Identified
   - 10:45 → ₹5,000 Transaction Recorded
   - 11:00 → Another Payment Requested
7. Module rail shows 6 modules (at least 4 with "HIT")
8. Missing panel shows: UTR (from Transaction #01)
9. Conflict panel shows: ₹5,000 vs ₹4,999 (difference ₹1)
10. Redaction toggle masks phone/email/UPI
11. Export JSON downloads as casebrief-CB-2026-001.json
12. Refresh page, data persists (IndexedDB)
```

---

## Priority Matrix (If Time Runs Out)

| Feature | Priority | Owner |
|---|---|---|
| 7-step stepper | 🔴 P0 | M1 |
| Phishing timeline (exact 4 events) | 🔴 P0 | M1 + M2 |
| Load demo button | 🔴 P0 | M1 + M2 |
| Six-module rail | 🔴 P0 | M1 |
| Module rules (all hit/idle) | 🔴 P0 | M2 |
| Missing UTR | 🔴 P0 | M2 |
| Amount contradiction (₹5,000 vs ₹4,999) | 🔴 P0 | M2 |
| Redaction UI | 🔴 P0 | M1 |
| Incident report | 🔴 P0 | M1 |
| JSON export | 🟠 P1 | M2 |
| File upload | 🟠 P1 | M1 + M2 |
| SHA-256 hashing | 🟠 P1 | M2 |
| IndexedDB persistence | 🟠 P1 | M2 |
| OCR / PDF extraction | 🟢 P2 | — |
| Graph visualizations | 🟢 P2 | — |

---

## Starting Now

### Member 1 (Frontend)
```bash
cd casebrief
git checkout -b feature/frontend-investigation-desk
npm install
# Start building src/components/ and src/pages/
# Reference: src/pages/InvestigationDesk.tsx (skeleton provided)
```

### Member 2 (Engine)
```bash
cd casebrief
git checkout -b feature/investigation-engine
npm install
# Create demo files in public/demo/
# Build extraction engine in src/extract/
# Build modules in src/modules/
```

---

## Helpful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# View build artifacts
npm run preview

# Check for TypeScript errors
npx tsc --noEmit
```

---

## Questions?

If blocked, refer to:
1. **Schema disputes:** Modify `src/types/incident.ts` together, commit, both pull
2. **Component naming:** Follow existing `src/components/*.tsx` pattern
3. **Module implementation:** Reference `src/modules/message.ts` for pattern
4. **Integration issues:** Ensure `loadDemoCase()` returns correct `Incident` type

**Key rule:** Member 1 never modifies `src/extract/`, `src/modules/`, `src/logic/`, `src/store/`, `src/utils/`. Member 2 never modifies `src/components/`, `src/pages/`, `src/styles/`.

Good luck! 🚀
