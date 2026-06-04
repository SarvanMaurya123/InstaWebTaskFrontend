"use client";

import { useState, useEffect } from "react";
import { useUpdateLead } from "@/hooks/leads/useUpdateLead";
import { X, User, Mail, Phone, Building2, FileText, ChevronDown } from "lucide-react";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export type Lead = {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  status?: LeadStatus;
  notes?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess: () => void;
};

const STATUS_OPTIONS: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW:       "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  CONTACTED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  QUALIFIED: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  CONVERTED: "bg-green-50 text-green-700 ring-1 ring-green-200",
  LOST:      "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const STATUS_DOT: Record<LeadStatus, string> = {
  NEW:       "bg-blue-400",
  CONTACTED: "bg-amber-400",
  QUALIFIED: "bg-purple-400",
  CONVERTED: "bg-green-400",
  LOST:      "bg-red-400",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const AVATAR_BG: Record<LeadStatus, string> = {
  NEW:       "bg-blue-100 text-blue-800",
  CONTACTED: "bg-amber-100 text-amber-800",
  QUALIFIED: "bg-purple-100 text-purple-800",
  CONVERTED: "bg-green-100 text-green-800",
  LOST:      "bg-red-100 text-red-700",
};

export default function EditLeadModal({ isOpen, onClose, lead, onSuccess }: Props) {
  const [form, setForm] = useState<Lead | null>(null);
  const { updateLead, isUpdating } = useUpdateLead();

  useEffect(() => {
    if (lead) setForm(lead);
  }, [lead]);

  if (!isOpen || !form) return null;

  const status = form.status || "NEW";

  const handleChange = (key: keyof Lead, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!form?._id) return;
    updateLead(
      {
        _id: form._id,
        data: {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          companyName: form.companyName,
          notes: form.notes,
          status: form.status,
        },
      },
      { onSuccess: () => { onSuccess(); onClose(); } }
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${AVATAR_BG[status]}`}>
              {getInitials(form.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{form.name || "Edit Lead"}</p>
              <p className="text-xs text-gray-400">{form.companyName || "No company"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="px-5 py-4 flex flex-col gap-3 overflow-y-auto">

          {/* STATUS SELECTOR */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleChange("status", s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    status === s
                      ? STATUS_STYLES[s]
                      : "bg-gray-50 text-gray-500 ring-1 ring-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status === s ? STATUS_DOT[s] : "bg-gray-300"}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-50" />

          {/* NAME */}
          <Field label="Name" icon={<User className="w-3.5 h-3.5" />}>
            <input
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Full name"
              className="field-input"
            />
          </Field>

          {/* EMAIL */}
          <Field label="Email" icon={<Mail className="w-3.5 h-3.5" />}>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@example.com"
              className="field-input"
            />
          </Field>

          {/* PHONE */}
          <Field label="Phone" icon={<Phone className="w-3.5 h-3.5" />}>
            <input
              type="tel"
              value={form.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="+91 98000 00000"
              className="field-input"
            />
          </Field>

          {/* COMPANY */}
          <Field label="Company" icon={<Building2 className="w-3.5 h-3.5" />}>
            <input
              value={form.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Company name"
              className="field-input"
            />
          </Field>

          {/* NOTES */}
          <Field label="Notes" icon={<FileText className="w-3.5 h-3.5" />}>
            <textarea
              value={form.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add notes about this lead…"
              rows={3}
              className="field-input resize-none"
            />
          </Field>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </span>
            ) : "Save changes"}
          </button>
        </div>
      </div>

      {/* Inline styles for field inputs — avoids repeating long Tailwind strings */}
      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 8px 10px;
          font-size: 13px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          color: #111827;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input::placeholder {
          color: #9ca3af;
        }
        .field-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}