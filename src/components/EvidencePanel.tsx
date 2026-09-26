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
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case "url":
        return <Link2 className="w-5 h-5 text-blue-400" />;
      case "message":
        return <FileText className="w-5 h-5 text-amber-400" />;
      default:
        return <FileCode className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Stage 1: Multi-Modal Evidence Intake & Custody
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ingest chat logs, URLs, CSV transaction statements, and raw fraud artifacts with SHA-256 integrity verification.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700 w-fit">
            {evidence.length} Evidence Artifacts Ingested
          </span>
        </div>

        {/* Upload & Manual Paste Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Dropzone */}
          <div className="lg:col-span-1 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-950/40 transition-colors">
            <Upload className="w-10 h-10 text-slate-500 mb-3" />
            <div className="text-sm font-semibold text-slate-200">
              Drag & Drop Evidence Files
            </div>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Supports .txt, .csv, .log, .pdf, or exported chats
            </p>
            <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
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
                <span className="text-xs font-semibold text-slate-400">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as EvidenceItem["type"])}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500"
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
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-3 py-1 flex-1 min-w-[200px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <textarea
              rows={3}
              placeholder="Paste raw WhatsApp text, suspicious link, or CSV statement content here..."
              value={rawTextInput}
              onChange={(e) => setRawTextInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !rawTextInput.trim()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
                Ingest & Hash Evidence
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Ingested Evidence Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
          <Fingerprint className="w-4 h-4 text-emerald-400" />
          Cryptographic Chain-of-Custody Registry (SHA-256)
        </h4>

        {evidence.map((item, idx) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/60 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  {getEvidenceIcon(item.type)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span>{item.filename || `Evidence Item #${idx + 1}`}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {item.id} • Ingested: {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* SHA-256 Hash Badge */}
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg max-w-full overflow-hidden">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono text-emerald-300 truncate max-w-[240px] sm:max-w-[280px]">
                  {item.hash || "Computing SHA-256..."}
                </span>
                {item.hash && (
                  <button
                    onClick={() => handleCopyHash(item.hash!)}
                    title="Copy SHA-256 Hash"
                    className="text-slate-400 hover:text-slate-200 ml-1 p-0.5"
                  >
                    {copiedHash === item.hash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <div className="mt-3 bg-slate-950/90 rounded-lg p-3 border border-slate-800/80">
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed">
                {item.extractedText}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
