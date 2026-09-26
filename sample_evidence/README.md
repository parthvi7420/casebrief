# Sample Evidence Test Dataset for CaseBrief

These files are designed for manual drag-and-drop into **Stage 1 (Evidence Ingestion)** of the CaseBrief Investigation Desk:

| File Name | Evidence Type | Key Investigation Triggers |
|---|---|---|
| `1_whatsapp_chat_evidence.txt` | Chat log / Messages | Urgency lure, KYC unblock demand, ₹5,000 extortion prompt, second ₹5,000 demand due to ₹1 mismatch |
| `2_sms_phishing_lure.txt` | SMS alert | HDFC-ALERT phishing notice, suspicious phone number (+919876543210), lookalike HTTP link |
| `3_upi_payment_records.csv` | UPI transaction log | First transaction ₹4,999 with **MISSING UTR**, second transaction ₹5,000 marked **FAILED** |
| `4_bank_core_ledger.csv` | Bank Core Ledger | **Exact Duplicate Entry** (UTR998877665544) showing settlement duplication |
| `5_suspicious_url.txt` | Extracted URL / IOC | Direct HTTP link (`http://pay-secure-example.test/verify`) triggering URL Reputation & Threat Intel modules |

---
*Note: `public/demo/` contains the internal bundled dataset loaded automatically by the **"Load Phishing Demo"** button.*
