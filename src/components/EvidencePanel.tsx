import React, { useState } from "react";
import { EvidenceItem } from "../types/incident";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Link2,
  Fingerprint,
  Copy,
  Check,
  PlusCircle,
  FileCode,
} from "lucide-react";
import { computeSHA256 } from "../utils/hashing";

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  onAddEvidence,
}) => {
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
      else if (text.includes("[") && text.includes("AM") || text.includes("PM")) inferredType = "message";

      onAddEvidence({
        id: `evidence-${Date.now().toString().slice(-4)}-${i}`,
        type: inferredType,
        filename: file.name,
        hash,
        extractedText: text,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const getEvidenceIcon = (type: EvidenceItem["type"]) => {
    switch (type) {
      case "csv":
      case "transaction":
        return <FileSpreadsheet className="w-4 h-4 text-cb-success" />;
      case "url":
        return <Link2 className="w-4 h-4 text-cb-primary" />;
      case "message":
        return <FileText className="w-4 h-4 text-cb-warning" />;
      default:
        return <FileCode className="w-4 h-4 text-cb-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="cb-surface p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
          <div>
            <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
              <Upload className="w-5 h-5 text-cb-primary" />
              Stage 1: Multi-Modal Evidence Intake & Custody
            </h3>
            <p className="text-xs text-cb-muted mt-1">
              Ingest chat logs, URLs, CSV transaction statements, and raw fraud artifacts with SHA-256 integrity verification.
            </p>
          </div>
          <span className="cb-badge cb-badge-idle">
            {evidence.length} Evidence Artifacts Ingested
          </span>
        </div>

        {/* Upload & Manual Paste Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dropzone */}
          <div className="lg:col-span-1 border-2 border-dashed border-cb-border hover:border-cb-primary rounded-cb-md p-6 flex flex-col items-center justify-center text-center bg-cb-bg/40 transition-colors">
            <Upload className="w-8 h-8 text-cb-muted mb-3" />
            <div className="text-xs font-semibold text-cb-text">
              Drag & Drop Evidence Files
            </div>
            <p className="text-[10px] text-cb-muted mt-1 mb-4">
              Supports .txt, .csv, .log, .pdf, or exported chats
            </p>
            <label className="cursor-pointer px-3.5 py-1.5 bg-cb-primary hover:bg-cb-primary-hover text-white text-xs font-semibold rounded-cb-md shadow-sm transition-colors">
              Browse Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Quick Paste Form */}
          <form onSubmit={handleManualSubmit} className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cb-muted">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as EvidenceItem["type"])}
                  className="bg-cb-bg border border-cb-border text-xs text-cb-text rounded-cb-sm px-2.5 py-1 focus:outline-none focus:border-cb-primary"
                >
                  <option value="message">WhatsApp / SMS Chat</option>
                  <option value="url">Suspicious URL / Phishing Link</option>
                  <option value="csv">Bank Statement CSV</option>
                  <option value="text">General Forensic Text</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Optional Label (e.g. chat_export.txt)"
                value={fileNameInput}
                onChange={(e) => setFileNameInput(e.target.value)}
                className="bg-cb-bg border border-cb-border text-xs text-cb-text rounded-cb-sm px-3 py-1 flex-1 min-w-[200px] focus:outline-none focus:border-cb-primary placeholder:text-cb-muted"
              />
            </div>

            <textarea
              rows={3}
              placeholder="Paste raw WhatsApp text, suspicious link, or CSV statement content here..."
              value={rawTextInput}
              onChange={(e) => setRawTextInput(e.target.value)}
              className="w-full bg-cb-bg border border-cb-border rounded-cb-sm p-3 text-xs text-cb-text font-mono focus:outline-none focus:border-cb-primary placeholder:text-cb-muted"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !rawTextInput.trim()}
                className="cb-btn-ghost flex items-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4 text-cb-primary" />
                Ingest & Hash Evidence
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Ingested Evidence Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cb-muted px-1 flex items-center gap-1.5">
          <Fingerprint className="w-4 h-4 text-cb-success" />
          Cryptographic Chain-of-Custody Registry (SHA-256)
        </h4>

        {evidence.map((item, idx) => (
          <div
            key={item.id}
            className="cb-surface border border-cb-border hover:border-cb-border-hover rounded-cb-md p-4 shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cb-border gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-cb-sm bg-cb-bg border border-cb-border flex items-center justify-center shrink-0">
                  {getEvidenceIcon(item.type)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-cb-text flex items-center gap-2">
                    <span>{item.filename || `Evidence Item #${idx + 1}`}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-bg text-cb-muted border border-cb-border-subtle uppercase">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-cb-muted font-mono">
                    ID: {item.id} • Ingested: {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* SHA-256 Hash Badge */}
              <div className="flex items-center gap-2 bg-cb-bg/80 border border-cb-border px-3 py-1.5 rounded-cb-sm max-w-full overflow-hidden">
                <Fingerprint className="w-3.5 h-3.5 text-cb-success shrink-0" />
                <span className="text-[10px] font-mono text-cb-success truncate max-w-[240px] sm:max-w-[280px]">
                  {item.hash || "Computing SHA-256..."}
                </span>
                {item.hash && (
                  <button
                    onClick={() => handleCopyHash(item.hash!)}
                    title="Copy SHA-256 Hash"
                    className="text-cb-muted hover:text-cb-text ml-1 p-0.5"
                  >
                    {copiedHash === item.hash ? (
                      <Check className="w-3.5 h-3.5 text-cb-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <div className="mt-3 bg-cb-bg/60 rounded-cb-sm p-3 border border-cb-border">
              <pre className="text-xs font-mono text-cb-text-secondary whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed">
                {item.extractedText}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
