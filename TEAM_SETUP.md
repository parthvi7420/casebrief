# CaseBrief Team Setup Guide

## Repository Ready ✅

**Repo:** https://github.com/parthvi7420/casebrief

The repository is initialized and ready for both team members to start working.

---

## For Member 1 (Person A - Frontend/UI)

### Step 1: Clone and Create Your Branch

```bash
cd your-workspace
git clone https://github.com/parthvi7420/casebrief.git
cd casebrief
git checkout -b feature/frontend-investigation-desk
npm install
```

### Step 2: Start Building (10-60 minutes)

Your primary files to create/modify:

```
src/components/
  ├── ProcessStepper.tsx      ← 7-step stepper
  ├── ModuleRail.tsx          ← 6 module status display
  ├── EvidencePanel.tsx       ← File upload/paste UI
  ├── ExtractionPanel.tsx     ← Show extracted entities
  ├── PhishingTimeline.tsx    ← **CRITICAL: Exact 4-event timeline**
  ├── MissingPanel.tsx        ← Missing data display
  ├── ConflictPanel.tsx       ← Data contradictions
  ├── RedactionPanel.tsx      ← Toggle sensitive data masking
  └── IncidentReport.tsx      ← Final report view

src/pages/
  └── InvestigationDesk.tsx   ← Main layout (skeleton provided)

src/styles/
  └── index.css               ← Tailwind styles
```

**Reference skeleton:** `src/pages/InvestigationDesk.tsx` (already in repo)

### Step 3: What NOT to Touch

❌ Do NOT modify:
- `src/extract/` — Member 2's extraction engine
- `src/modules/` — Member 2's security modules
- `src/logic/` — Member 2's business logic
- `src/store/` — Member 2's data persistence
- `src/utils/` — Member 2's utilities
- `public/demo/` — Member 2's demo data
- `src/types/incident.ts` — Shared (frozen after agreement)

### Step 4: Integration Point (90 minutes)

Wait for Member 2 to push their feature branch. Then:

```bash
git pull origin main
npm install
```

Connect the UI to the engine:

```typescript
// In InvestigationDesk.tsx
import { loadDemoCase } from '../logic/incident'

const handleLoadDemo = async () => {
  const incident = loadDemoCase()
  setIncident(incident)
}
```

---

## For Member 2 (Partner - Investigation Engine)

### Step 1: Clone and Create Your Branch

```bash
cd your-workspace
git clone https://github.com/parthvi7420/casebrief.git
cd casebrief
git checkout -b feature/investigation-engine
npm install
```

### Step 2: Start Building (10-60 minutes)

Your primary work areas:

```
public/demo/
  ├── phishing_message.txt    ← Synthetic phishing message (10:34)
  ├── suspicious_url.txt      ← Malicious URL (10:35)
  └── transactions.csv        ← Transactions with ₹5,000 (10:45) and payment request (11:00)

src/extract/
  ├── dates.ts                ← DD/MM/YYYY, ISO, WhatsApp timestamps
  ├── money.ts                ← ₹5000, Rs 5000, INR 5000 formats
  ├── urls.ts                 ← HTTP/HTTPS detection
  ├── payments.ts             ← UPI (name@okaxis), phone, email
  └── index.ts                ← Export all extractors

src/modules/
  ├── message.ts              ← Detect phishing keywords
  ├── url.ts                  ← Detect suspicious URLs
  ├── network.ts              ← Domain analysis
  ├── intel.ts                ← Threat intelligence patterns
  ├── transaction.ts          ← Transaction auditing
  └── fraudLog.ts             ← Event logging

src/logic/
  ├── timeline.ts             ← Build chronological timeline
  ├── gaps.ts                 ← Detect missing required fields
  ├── conflicts.ts            ← Find data contradictions
  ├── redaction.ts            ← Mask sensitive information
  └── incident.ts             ← **loadDemoCase() function**

src/store/
  └── caseStore.ts            ← IndexedDB persistence

src/utils/
  ├── hashing.ts              ← SHA-256 hashing
  └── export.ts               ← JSON export (shareable + full)
```

### Step 3: Critical Demo Requirements

Your `loadDemoCase()` must return an `Incident` with:

**Timeline (exact order and times):**
```
10:34 AM → Suspicious Message Received
10:35 AM → Suspicious URL Identified
10:45 AM → ₹5,000 Transaction Recorded
11:00 AM → Another Payment Requested
```

**Gaps:**
```
UTR → MISSING (from Transaction #01)
```

**Conflicts:**
```
Amount mismatch:
  Source 1 (Message): ₹5,000
  Source 2 (CSV): ₹4,999
  Difference: ₹1
```

**Module Hits:**
```
All 6 modules should report "HIT" status with reasons
```

### Step 4: What NOT to Touch

❌ Do NOT modify:
- `src/components/` — Member 1's UI components
- `src/pages/` — Member 1's pages
- `src/styles/` — Member 1's styling
- `src/types/incident.ts` — Shared (frozen after agreement)

### Step 5: Push and Merge (90 minutes)

When your feature is ready:

```bash
git add src/extract/ src/modules/ src/logic/ src/store/ src/utils/ public/demo/
git commit -m "feat(core): add investigation engine

- Extraction engine (dates, money, URLs, UPI, etc.)
- Six security modules with configurable rules
- Timeline building with chronological ordering
- Gap detection for required fields
- Conflict detection for data mismatches
- Redaction engine for sensitive data
- SHA-256 hashing and JSON export
- IndexedDB persistence"

git push -u origin feature/investigation-engine
```

Then create a Pull Request on GitHub.

---

## The Shared Contract

**Do not modify after agreement:**

```typescript
// src/types/incident.ts
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
}
```

**Member 2 must expose:**
```typescript
loadDemoCase(): Incident
processEvidence(evidence: EvidenceItem[]): Promise<Incident>
```

---

## Development Timeline

| Time | Member 1 (Frontend) | Member 2 (Engine) |
|---|---|---|
| 0–10 min | Setup & agree on schema | Setup & agree on schema |
| 10–60 min | Stepper, ModuleRail, Timeline | Extractors, modules, timeline logic |
| 60–90 min | Missing, Conflict, Redaction, Report | Gaps, conflicts, redaction, export |
| 90 min | **MERGE POINT** | Push feature/investigation-engine |
| 90–105 min | Integrate & test together | QA together |
| 105–120 min | Demo hardening | Demo hardening |

---

## Must-Work Demo Sequence (120 minutes)

```bash
1. npm install
2. npm run dev
3. Browser → localhost:5173
4. Click "LOAD DEMO"
5. ✅ Stepper shows 7 active steps
6. ✅ Timeline shows 4 events at correct times
7. ✅ Module rail shows 6 modules (4+ with "HIT")
8. ✅ Missing panel shows "UTR"
9. ✅ Conflict panel shows "₹5,000 vs ₹4,999"
10. ✅ Redaction toggle works
11. ✅ Export produces JSON
12. ✅ Refresh → data persists
```

---

## Git Commands Quick Reference

### Member 1 (Frontend)

```bash
# Create branch
git checkout -b feature/frontend-investigation-desk

# Work on files
git add src/components/ src/pages/ src/styles/
git commit -m "feat(ui): [description]"

# At 90 minutes, pull engine code
git pull origin main

# When done, push and create PR
git push -u origin feature/frontend-investigation-desk
```

### Member 2 (Engine)

```bash
# Create branch
git checkout -b feature/investigation-engine

# Work on files
git add src/extract/ src/modules/ src/logic/ src/store/ src/utils/ public/demo/
git commit -m "feat(core): [description]"

# At 90 minutes, push to main
git push -u origin feature/investigation-engine

# Create PR on GitHub
```

---

## Useful Commands

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Build for production
npm run build

# Preview build
npm run preview
```

---

## If You Get Stuck

1. **Schema confusion?** → Refer to `src/types/incident.ts` (frozen after first agreement)
2. **Component naming?** → Follow `src/components/*.tsx` pattern
3. **Module pattern?** → Check existing module files for structure
4. **Integration issues?** → Ensure `loadDemoCase()` returns correct `Incident` type

---

## Key Rule

**Zero file conflicts if you follow ownership:**

- **Member 1:** Only touch `src/components/`, `src/pages/`, `src/styles/`
- **Member 2:** Only touch `src/extract/`, `src/modules/`, `src/logic/`, `src/store/`, `src/utils/`, `public/demo/`
- **Both:** Agree on `src/types/incident.ts` once, then freeze it

Good luck! 🚀
