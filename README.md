# CaseBrief v2.0 — Cyber Forensics & Digital Fraud Evidence Reconstruction Desk

CaseBrief is an enterprise-grade, privacy-first cybersecurity investigation platform engineered to ingest unorganized, multi-modal digital fraud evidence (WhatsApp exports, SMS records, phishing URLs, bank statements, CSV transaction logs, network/DNS traces) and deterministically reconstruct an immutable, court-admissible forensic incident report.

Built with a **zero-hallucination, deterministic architecture**, CaseBrief eliminates the evidentiary risks of generative AI in judicial and law-enforcement workflows. Every entity, timeline event, contradiction, and investigative gap is parsed via rigorous rule engines and cryptographically bound to source evidence through SHA-256 chain-of-custody tracking.

---

## Key Capabilities & Forensic Pipeline

CaseBrief implements an end-to-end 7-stage investigative workflow designed for cybercrime units, fraud analysts, incident response teams, and compliance officers:

```
[Evidence Intake] ──► [Entity Extraction & Normalization] ──► [Chronological Timeline]
       │                                                                │
       ▼                                                                ▼
[Chain-of-Custody]                                            [6-Module Security Rail]
       │                                                                │
       ▼                                                                ▼
[Gap & Checklist Engine] ──► [Contradiction Analysis] ──► [Privacy Redaction] ──► [Incident Report & Export]
```

### 1. Cryptographic Evidence Intake & Chain of Custody (Stage 1)
- **Multi-Modal Ingestion**: Ingests WhatsApp exports (`.txt`), bank transaction ledgers (`.csv`), network logs, phishing URLs, and raw evidentiary text.
- **SHA-256 Digest Computation**: Instantaneously hashes each ingested artifact using the Web Crypto API / Node.js cryptographic engine, establishing an immutable chain-of-custody timestamp.
- **Evidence Registry**: Tracks file size, MIME type, origin source, and custody verification hashes.

### 2. Deterministic Entity Extraction & Dataset Normalization (Stage 2)
- **Stage 2a — Entity Extraction Grid**:
  - **Domains & Target URLs**: Protocol inspection (flagging HTTP over HTTPS), domain isolation, port parsing.
  - **Financial Currency Amounts**: Indian Rupee currency normalization (`₹`, `Rs.`, `INR`) and numeric parsing.
  - **UPI Handles / VPAs**: Identifies Virtual Payment Addresses across major handles (`*@oksbi`, `*@okaxis`, `*@paytm`, `*@icici`, etc.).
  - **Bank UTR / Reference IDs**: Extracts 12-digit Unique Transaction Reference numbers.
  - **Contact Identifiers**: Phone number normalization (`+91` format) and RFC 5322 email parsing.
  - **Bank Account Identifiers**: Beneficiary and sender account number isolation.
  - **Urgency & Threat Lures**: Keyword heuristic extraction targeting KYC panic triggers, account suspension threats, and electricity bill scams.
- **Stage 2b — Forensic Dataset Normalization Engine**:
  - Automatically resolves heterogeneous CSV headers (`rrn`, `utr_no`, `txn_amt`, `debit`, `sender_acc`, `payee_vpa`) against canonical forensic transaction schemas.
  - Generates bidirectional visual mapping cards showing raw column origins mapped to standard forensic fields.

### 3. Chronological Narrative & Timeline Reconstruction (Stage 3)
- **Timestamp Synthesis**: Normalizes diverse timestamp formats (ISO-8601, WhatsApp bracket notation `[DD/MM/YY, HH:mm:ss]`, bank statement dates) into a unified chronological sequence.
- **Interactive Timeline Cards**: Renders time-stamped attack milestones with risk badges, source references, and triggering security module tags.

### 4. Investigative Gap Analysis & Checklist Engine (Stage 4)
- **Statutory Gap Detection**: Automatically detects missing mandatory forensic attributes (e.g., flagging unreferenced debit transactions lacking 12-digit bank UTR numbers).
- **Compliance Checklist**: Evaluates case preparedness against standard statutory reporting requirements for law enforcement escalation.

### 5. Multi-Source Contradiction & Discrepancy Detection (Stage 5)
- **Cross-Evidence Anomaly Matching**: Identifies evidentiary discrepancies between communication channels and financial records (e.g., WhatsApp chat demanding `₹5,000` vs. bank ledger reflecting a `₹4,999` debit with a `₹1` discrepancy).
- **Discrepancy Severity Weighting**: Categorizes friction points as Critical, Warning, or Informational for forensic cross-examination.

### 6. Interactive Privacy Redaction & Sanitization Sandbox (Stage 6)
- **Client-Side PII Masking**: Automatically masks sensitive personal identifiers (`+91 ******3210`, `******@oksbi`, `****4521`, redacted email handles) to prevent privacy violations during multi-agency sharing.
- **Interactive Reveal Sandbox**: Allows authorized investigators to toggle between sanitized views and unredacted values.
- **Dual-State JSON Export**: Produces both **Shareable Redacted JSON** (sanitized for inter-agency intelligence) and **Full Forensic JSON** (complete records for judicial proceedings).

### 7. Executive Incident Report & Export Dossier (Stage 7)
- **Formal Judicial Dossier**: Generates comprehensive case dossiers featuring Executive Summaries, financial loss totals, IOC summaries, complete forensic narratives, discrepancy audits, and investigator sign-off blocks.
- **Print / PDF Engine**: Specialized `@media print` stylesheets strip interface chrome and render crisp, professional, multi-page FIR-compliant PDF reports.

---

## 6-Module Real-Time Cybersecurity Analysis Suite

The application features a real-time 6-module analysis engine operating across all ingested evidence:

| Module | Purpose | Detection Focus |
|---|---|---|
| **1. Message Analyzer** | Social Engineering Detection | Scans for urgency triggers, impersonation keywords (SBI, KYC, Bank Support), account suspension threats, and OTP harvesting patterns. |
| **2. URL Reputation Check** | Phishing & Infrastructure Audit | Flags insecure HTTP protocols, typosquatting/homograph domains, numeric IP hostnames, and suspicious payment gateway paths. |
| **3. Network Monitoring** | Connection & DNS Log Audit | Audits DNS resolution events, communication endpoint IP addresses, port anomalies, and exfiltration telemetry. |
| **4. Threat Intelligence Feed** | Known IOC Matching | Compares extracted domains, URLs, hashes, and phone numbers against bundled known-malicious threat actor infrastructure. |
| **5. Transaction Auditor** | Financial Anomaly & Ledger Verification | Validates transaction amounts, split-payment patterns, unreferenced transfers, and velocity anomalies. |
| **6. Fraud Attempt Log** | Forensic Timeline Audit | Assembles a tamper-evident audit record of every fraudulent interaction and payment attempt. |

---

## Advanced Forensic Engines

### Multi-Attribute Record Matching (`src/logic/matching.ts`)
Calculates composite weighted confidence scores to link disparate evidence items:
- **UTR Exact Match**: 95% confidence
- **Amount + Counterparty Match**: 85% confidence
- **Amount + 10-minute Time Window**: 75% confidence
- **Partial Entity Match**: 60% confidence

### Non-Destructive Duplicate Detection (`src/logic/duplicates.ts`)
- Detects exact content duplicates via SHA-256 hash matching.
- Identifies semantic duplicates across differing formats without data loss.
- Groups redundant items under canonical master records while preserving full provenance.

### Assumption & Forensic Truth Engine (`src/logic/assumptions.ts`)
Classifies every investigative assertion into three distinct evidentiary tiers:
1. **Confirmed Facts**: Directly supported by cryptographic hashes or official bank ledgers.
2. **Evidentiary Inferences**: Deduced from corroborating timestamps or communication patterns.
3. **Hypotheses**: Unverified claims requiring further subpoena or external verification.

### Bidirectional Source Traceability Matrix (`src/logic/traceability.ts`)
Maintains an exhaustive, byte-level registry connecting every extracted entity, timeline entry, and financial figure back to its source evidence file, line number, and character offset.

---

## Architecture & Technology Stack

### Frontend Application
- **Framework**: React 18 with TypeScript 5.7
- **Bundler & Tooling**: Vite 6, PostCSS, Autoprefixer
- **Styling & Cyber Theme**: Tailwind CSS 3.4 with custom Cyber Forensics design tokens (`#080D18` dark slate background, `#0D1422` surface, `#4F8CFF` primary accent, `#26D9A0` success green, `#F5B942` warning amber, `#F0526F` critical crimson)
- **Icons**: Lucide React
- **Local Persistence**: IndexedDB via `idb` library (supports fully offline, air-gapped operation)
- **Utilities**: `clsx`, `tailwind-merge`

### Backend Service (Optional / Enterprise Mode)
- **Runtime**: Node.js (ES Modules) with TypeScript
- **Web Framework**: Express 4 with security middleware (`helmet`, `cors`, `morgan`)
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Validation & Parsing**: Zod schema validators, Multer file upload handling
- **Testing**: Native TSX test suites (`src/tests/verifyMember2.ts`, `backend/src/tests/runAllTests.ts`)

---

## Repository Structure

```
casebrief/
├── public/
│   └── demo/                          # Benchmark forensic evidence files
│       ├── phishing_message.txt       # WhatsApp KYC fraud transcript
│       ├── suspicious_url.txt         # HTTP phishing payment link
│       └── transactions.csv           # Bank ledger with UTR & discrepancy
├── src/
│   ├── types/
│   │   └── incident.ts                # Master unified forensic TypeScript contracts
│   ├── extract/                       # Deterministic Zero-AI Extraction Subsystems
│   │   ├── dates.ts                   # Date & timestamp normalizer
│   │   ├── money.ts                   # Currency & amount parser
│   │   ├── urls.ts                    # URL, domain & protocol parser
│   │   ├── payments.ts                # UPI, UTR, & account extractors
│   │   ├── entities.ts                # Contact, phone & email parsers
│   │   ├── whatsapp.ts                # Multi-participant WhatsApp log parser
│   │   ├── csv.ts                     # Robust CSV parser
│   │   └── index.ts
│   ├── modules/                       # 6-Module Real-Time Cybersecurity Engine
│   │   ├── message.ts                 # Social engineering & message analyzer
│   │   ├── url.ts                     # URL reputation & homograph auditor
│   │   ├── network.ts                 # Network log & DNS auditor
│   │   ├── intel.ts                   # Threat intelligence IOC matcher
│   │   ├── transaction.ts             # Financial ledger auditor
│   │   ├── fraudLog.ts                # Fraud attempt audit log
│   │   └── index.ts
│   ├── logic/                         # Reconstruction, Analytics & Forensics Logic
│   │   ├── timeline.ts                # Chronological narrative constructor
│   │   ├── gaps.ts                    # Statutory gap evaluator
│   │   ├── conflicts.ts               # Contradiction & discrepancy detector
│   │   ├── redaction.ts               # PII masking & sanitization engine
│   │   ├── normalize.ts               # Dataset normalization & alias mapping
│   │   ├── matching.ts                # Multi-attribute record linker
│   │   ├── duplicates.ts              # Non-destructive duplicate detector
│   │   ├── assumptions.ts             # Truth classification engine
│   │   ├── traceability.ts            # Source traceability registry
│   │   ├── checklist.ts               # Statutory checklist engine
│   │   ├── demoCase.ts                # Benchmark case generator
│   │   └── incident.ts                # Master processEvidence pipeline
│   ├── store/
│   │   └── caseStore.ts               # Client-side IndexedDB persistence
│   ├── utils/
│   │   ├── hashing.ts                 # Web Crypto SHA-256 implementation
│   │   └── export.ts                  # Sanitized & full JSON export handlers
│   ├── services/
│   │   └── apiClient.ts               # REST API client with offline fallback
│   ├── components/                    # Investigation Desk UI Panels & Rails
│   │   ├── ProcessStepper.tsx         # 7-Stage workflow navigation
│   │   ├── ModuleRail.tsx             # 6-Module status rail with HIT/IDLE badges
│   │   ├── EvidencePanel.tsx          # Stage 1: Drag-and-drop intake & SHA-256
│   │   ├── ExtractionPanel.tsx        # Stage 2a: Entity extraction grid
│   │   ├── DataNormalizationUI.tsx    # Stage 2b: CSV schema mapping
│   │   ├── PhishingTimeline.tsx       # Stage 3: Interactive narrative timeline
│   │   ├── MissingPanel.tsx           # Stage 4: Investigative gaps
│   │   ├── ConflictPanel.tsx          # Stage 5: Cross-evidence contradictions
│   │   ├── RedactionPanel.tsx         # Stage 6: Privacy masking sandbox
│   │   ├── EnhancedIncidentReport.tsx # Stage 7: Comprehensive incident dossier
│   │   ├── DuplicatesPanel.tsx        # Duplicate evidence management
│   │   ├── AssumptionsPanel.tsx       # Forensic truth classification UI
│   │   ├── SourceTraceability.tsx     # Evidence provenance inspector
│   │   └── ReportingChecklist.tsx     # Statutory milestone checklist UI
│   ├── pages/
│   │   └── InvestigationDesk.tsx      # Main application desk orchestrator
│   ├── styles/
│   │   └── index.css                  # Tailwind tokens & print formatting
│   ├── tests/
│   │   └── verifyMember2.ts           # 21-Subsystem forensic logic verification suite
│   ├── App.tsx
│   └── main.tsx
├── backend/                           # Enterprise REST API & Database Service
│   ├── prisma/
│   │   └── schema.prisma              # PostgreSQL relational forensic schema
│   ├── src/
│   │   ├── controllers/               # Express route controllers
│   │   ├── routes/                    # API endpoints
│   │   ├── services/                  # Server-side forensic engines
│   │   ├── middleware/                # Validation, error handling, file upload
│   │   ├── config/                    # Environment & database configuration
│   │   └── server.ts                  # Express server entrypoint
│   └── package.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Installation & Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### Quick Start (Frontend Investigation Desk)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/parthvi7420/casebrief.git
   cd casebrief
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

4. **Execute the forensic test suite**:
   ```bash
   npx tsx src/tests/verifyMember2.ts
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

### Backend Service (Optional Enterprise Mode)

CaseBrief operates completely standalone in the browser using IndexedDB. If multi-user synchronization and PostgreSQL database persistence are required:

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/casebrief?schema=public"
   CORS_ORIGIN="http://localhost:5173"
   ```

3. **Initialize Prisma & start server**:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run dev
   ```

---

## REST API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and database connection status |
| `POST` | `/api/cases` | Create a new forensic investigation case |
| `GET` | `/api/cases/:id` | Retrieve full case record with evidence and findings |
| `POST` | `/api/cases/:id/evidence` | Ingest and cryptographically hash evidence files |
| `POST` | `/api/cases/:id/evidence/upload` | Multipart file upload with automated SHA-256 calculation |
| `GET` | `/api/cases/:id/timeline` | Get reconstructed chronological timeline |
| `GET` | `/api/cases/:id/findings` | Get extracted entities, gaps, conflicts, and module hits |
| `GET` | `/api/cases/:id/checklist` | Get statutory compliance checklist score |
| `GET` | `/api/cases/:id/report` | Generate full executive incident report (Sanitized / Full) |
| `POST` | `/api/demo/phishing` | Ingest benchmark Case #CB-2026-001 demo evidence |

---

## Benchmark Case Walkthrough (`#CB-2026-001`)

To demonstrate the platform's capabilities, CaseBrief includes a pre-packaged benchmark investigation (**Case #CB-2026-001: KYC Phishing & Unauthorized UPI Debit**):

1. **Intake Evidence**:
   - `phishing_message.txt`: WhatsApp message at `10:34 AM` threatening SBI account deactivation within 24 hours.
   - `suspicious_url.txt`: Insecure HTTP link `http://pay-secure-example.test/sbi-kyc-update` received at `10:35 AM`.
   - `transactions.csv`: Bank transaction ledger reflecting a `₹4,999` debit at `10:45 AM` to `fraudster@oksbi` with missing UTR number, followed by a second `₹5,000` attempt at `11:00 AM`.
2. **Reconstruction Output**:
   - **Chronological Narrative**: 4-event sequence assembled from `10:34 AM` to `11:00 AM`.
   - **Module Hits**: All 6 Security Modules flag active threats (Message Analyzer, URL Reputation, Threat Intel, Network Monitor, Transaction Auditor, Fraud Attempt Log).
   - **Gap Identification**: Flags missing 12-digit UTR on Transaction #01 as a primary investigative roadblock.
   - **Contradiction Flagged**: Identifies `₹1` discrepancy between chat claim (`₹5,000`) and ledger entry (`₹4,999`).
   - **Privacy Redaction**: Masks victim and suspect phone numbers, emails, and account numbers.
   - **Dossier Export**: Downloads FIR-ready judicial PDF and verified JSON exports.

---

## Security, Privacy & Air-Gap Compliance

- **Zero-Egress Processing**: In client mode, all deterministic parsing, timeline assembly, and PII redaction occur entirely within the browser's JavaScript V8 engine and IndexedDB.
- **Reproducible Verification**: Zero probabilistic or stochastic outputs; same inputs yield mathematically identical SHA-256 hashes, extracted entities, and contradiction diffs.
- **Cryptographic Chain of Custody**: Continuous integrity auditing ensures evidence tampering is immediately detectable across all investigative phases.

---

## License

CaseBrief is released under the **MIT License**.
