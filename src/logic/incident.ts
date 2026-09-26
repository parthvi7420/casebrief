import { Incident } from '../types/incident'

export function loadDemoCase(): Incident {
  return {
    id: 'demo-001',
    createdAt: new Date().toISOString(),
    caseNumber: 'CB-2026-001',
    summary: {
      title: 'Phishing and UPI Fraud',
      fraudType: 'Phishing / UPI',
      estimatedLoss: 5000,
      currency: 'INR',
    },
    parties: [
      { name: 'Victim', identifier: 'user123', role: 'sender' },
      { name: 'Fraudster', identifier: 'unknown', role: 'receiver' },
    ],
    channels: [
      { type: 'whatsapp', identifier: '+91-9876-543210' },
      { type: 'bank', identifier: 'HDFC Bank' },
    ],
    transactions: [
      {
        id: 'txn-001',
        amount: 5000,
        currency: 'INR',
        timestamp: '2026-01-15T10:45:00Z',
        upi: 'fraud@oksbi',
        utr: undefined,
        counterparty: 'fraudster',
      },
      {
        id: 'txn-002',
        amount: 4999,
        currency: 'INR',
        timestamp: '2026-01-15T10:45:30Z',
        upi: 'fraud@okaxis',
        utr: undefined,
        counterparty: 'fraudster',
      },
    ],
    timeline: [
      {
        id: 'evt-001',
        time: '10:34 AM',
        title: 'Suspicious Message Received',
        description: 'Phishing link in a message',
        sourceIds: ['evidence-001'],
        modulesFired: ['Message Analyzer'],
      },
      {
        id: 'evt-002',
        time: '10:35 AM',
        title: 'Suspicious URL Identified',
        description: 'URL flagged as potentially malicious',
        sourceIds: ['evidence-002'],
        modulesFired: ['URL Reputation Check'],
      },
      {
        id: 'evt-003',
        time: '10:45 AM',
        title: '₹5,000 Transaction Recorded',
        description: 'Payment detected in chat',
        sourceIds: ['evidence-003'],
        modulesFired: ['Transaction Auditor', 'Fraud Attempt Log'],
      },
      {
        id: 'evt-004',
        time: '11:00 AM',
        title: 'Another Payment Requested',
        description: 'Second payment request detected in transaction log',
        sourceIds: ['evidence-003'],
        modulesFired: ['Transaction Auditor', 'Fraud Attempt Log'],
      },
    ],
    gaps: [
      {
        field: 'UTR',
        transaction: 'txn-001',
        status: 'missing',
        required: true,
      },
    ],
    conflicts: [
      {
        type: 'Amount',
        source1: 'Chat Message',
        source2: 'Transaction CSV',
        value1: '₹5,000',
        value2: '₹4,999',
        difference: '₹1',
      },
    ],
    moduleHits: [
      { module: 'Message Analyzer', status: 'hit', reasons: ['Phishing keywords detected', 'Urgent language'] },
      { module: 'URL Reputation Check', status: 'hit', reasons: ['HTTP protocol', 'Payment-related domain'] },
      { module: 'Network Monitoring', status: 'idle' },
      { module: 'Threat Intelligence Feed', status: 'hit', reasons: ['Suspicious pattern matched'] },
      { module: 'Transaction Auditor', status: 'hit', reasons: ['Anomalous amount', 'Duplicate UPI'] },
      { module: 'Fraud Attempt Log', status: 'hit', reasons: ['Multiple payment requests'] },
    ],
    fraudAttemptLog: [
      {
        timestamp: '2026-01-15T10:34:00Z',
        event: 'Phishing message detected',
        reason: 'Malicious keywords found',
        modulesFired: ['Message Analyzer'],
      },
      {
        timestamp: '2026-01-15T10:35:00Z',
        event: 'Suspicious URL detected',
        reason: 'HTTP connection, payment path',
        modulesFired: ['URL Reputation Check'],
      },
      {
        timestamp: '2026-01-15T10:45:00Z',
        event: 'Transaction detected',
        reason: 'Large amount to suspicious UPI',
        modulesFired: ['Transaction Auditor'],
      },
      {
        timestamp: '2026-01-15T11:00:00Z',
        event: 'Second payment request',
        reason: 'Multiple transactions from same fraudster',
        modulesFired: ['Fraud Attempt Log'],
      },
    ],
    evidence: [
      {
        id: 'evidence-001',
        type: 'message',
        content: `10:34 AM
Hey! This is urgent. Your account needs verification.
Click here: http://pay-secure-example.test/verify
Do it NOW!`,
        timestamp: '2026-01-15T10:34:00Z',
        hash: 'a8c2d9e4f1b3c5a7e9f1b3c5d7e9f1b3c5d7e9f',
        metadata: { source: 'WhatsApp' },
      },
      {
        id: 'evidence-002',
        type: 'url',
        content: 'http://pay-secure-example.test/verify',
        timestamp: '2026-01-15T10:35:00Z',
        hash: 'b9d3e0f5g2c4d6b8f0g2c4d6e8f0g2c4d6e8f0g',
        metadata: { source: 'Message Link' },
      },
      {
        id: 'evidence-003',
        type: 'transaction',
        content: `Transaction Log:
Time,Amount,UPI,Status
10:45,5000,fraud@oksbi,Success
10:45,4999,fraud@okaxis,Success`,
        timestamp: '2026-01-15T10:45:00Z',
        hash: 'c0e4f1g6h3d5e7c9g1h3d5e7f9g1h3d5e7f9g1h',
        metadata: { source: 'Bank CSV Export' },
      },
    ],
  }
}
