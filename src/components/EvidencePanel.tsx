import React, { useState } from "react";
import { EvidenceItem } from "../types/incident";
import { Upload, FileText, FileSpreadsheet, Link2, Fingerprint, Copy, Check, PlusCircle, FileCode } from "lucide-react";
import { computeSHA256 } from "../utils/hashing";

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence, onAddEvidence }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [rawTextInput, setRawTextInput] = useState("");
  const [selectedType, setSelectedType] = useState<EvidenceItem["type"]>("message");
  const [fileNameInput, setFileNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTextInput.trim()) return;

    setIsSubmitting(true);
    const hash = await computeSHA256(rawTextInput);
    const newId = `evidence-${Date.now().toString().slice(-4)}`;

    onAddEvidence({
      id: newId,
      type: selectedType,
      filename: fileNameInput.trim() || `manual_intake_${selectedType}.txt`,
      hash,
      extractedText: rawTextInput,
      createdAt: new Date().toISOString(),
    });

    setRawTextInput("");
    setFileNameInput("");
    setIsSubmitting(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        const hash = await computeSHA256(text);
        let inferredType: EvidenceItem["type"] = "text";
        if (file.name.endsWith(".csv")) inferredType = "csv";
        else if (file.name.endsWith(".pdf")) inferredType = "pdf";
        else if (text.startsWith("http://") || text.startsWith("https://")) inferredType = "url";
        else if (text.includes("[") && (text.includes("AM") || text.includes("PM"))) inferredType = "message";
        onAddEvidence({ id: `evidence-${Date.now().toString().slice(-4)}-${i}`, type: inferredType, filename: file.name, hash, extractedText: text, createdAt: new Date().toISOString() });
    }
  };

  const getEvidenceIcon = (type: EvidenceItem["type"]) => {
    switch (type) {
      case "csv": case "transaction": return <FileSpreadsheet className="w-5 h-5 text-cb-success" />;
      case "url": return <Link2 className="w-5 h-5 text-cb-primary" />;
      case "message": return <FileText className="w-5 h-5 text-cb-warning" />;
      default: return <FileCode className="w-5 h-5 text-cb-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="cb-surface p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
          <div>
            <h3 className="text-lg font-bold text-cb-text flex items-center gap-2">
              <Upload className="w-5 h-5 text-cb-primary" />
              Stage 1: Forensic Evidence Locker
            </h3>
            <p className="text-xs text-cb-muted mt-1">Ingest artifacts for hash-chain verified custody.</p>
          </div>
          <span className="cb-badge cb-badge-idle">{evidence.length} Artifacts Ingested</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="border border-dashed border-cb-border rounded-cb-lg p-6 flex flex-col items-center justify-center text-center bg-cb-bg/40">
            <Upload className="w-8 h-8 text-cb-muted mb-3" />
            <div className="text-sm font-semibold text-cb-text">Drag & Drop Evidence</div>
            <p className="text-xs text-cb-muted mb-4">.txt, .csv, .pdf, or chat exports</p>
            <label className="cb-btn-ghost cursor-pointer">
              Browse Files<input type="file" multiple className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3">
             <div className="flex gap-2">
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as EvidenceItem["type"])} className="bg-cb-surface border border-cb-border text-xs rounded-cb-sm p-2 text-cb-text">
                  <option value="message">WhatsApp / SMS</option>
                  <option value="url">Phishing URL</option>
                  <option value="csv">Bank CSV</option>
                  <option value="text">Forensic Text</option>
                </select>
                <input placeholder="File Label (optional)" value={fileNameInput} onChange={(e) => setFileNameInput(e.target.value)} className="flex-1 bg-cb-bg border border-cb-border rounded-cb-sm p-2 text-xs text-cb-text placeholder-cb-muted/70 focus:border-cb-primary" />
             </div>
             <textarea rows={3} placeholder="Paste raw evidence content..." value={rawTextInput} onChange={(e) => setRawTextInput(e.target.value)} className="w-full bg-cb-bg border border-cb-border rounded-cb-sm p-3 text-xs text-cb-text font-mono placeholder-cb-muted/70 focus:border-cb-primary" />
             <button type="submit" disabled={isSubmitting || !rawTextInput.trim()} className="cb-btn-primary w-full flex items-center justify-center gap-2">
                <PlusCircle className="w-4 h-4" /> Ingest & Hash
             </button>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cb-muted px-1 flex items-center gap-1.5">
          <Fingerprint className="w-4 h-4 text-cb-success" />
          Cryptographic Registry (SHA-256)
        </h4>

        {evidence.map((item, idx) => (
          <div key={item.id} className="cb-elevated p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-cb-md bg-cb-bg flex items-center justify-center">{getEvidenceIcon(item.type)}</div>
              <div>
                <div className="text-sm font-semibold text-cb-text">{item.filename || `Artifact #${idx + 1}`}</div>
                <div className="text-[10px] text-cb-muted font-mono">{item.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-cb-bg border border-cb-border px-3 py-1.5 rounded-cb-sm font-mono text-xs text-cb-primary">
              <Fingerprint className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{item.hash?.slice(0, 16)}...</span>
              <button onClick={() => handleCopyHash(item.hash!)} className="cb-icon-btn w-6 h-6">
                {copiedHash === item.hash ? <Check className="w-3 h-3 text-cb-success" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
