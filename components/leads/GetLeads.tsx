"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { leadService } from "@/services/leadService";
import { useDeleteLead } from "@/hooks/leads/useDelete";
import { toast, Toaster } from "react-hot-toast";
import { Mail, Phone, Building2, Edit3, Trash2, Search } from "lucide-react";
import EditLeadModal from "./EditLeadModal";

type Lead = {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  status?: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  notes?: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const;

const STATUS_STYLES: Record<string, { badge: string; avatar: string; dot: string }> = {
  NEW:       { badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",     avatar: "bg-blue-100 text-blue-800",   dot: "bg-blue-400" },
  CONTACTED: { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",  avatar: "bg-amber-100 text-amber-800", dot: "bg-amber-400" },
  QUALIFIED: { badge: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",avatar: "bg-purple-100 text-purple-800",dot: "bg-purple-400" },
  CONVERTED: { badge: "bg-green-50 text-green-700 ring-1 ring-green-200",  avatar: "bg-green-100 text-green-800", dot: "bg-green-400" },
  LOST:      { badge: "bg-red-50 text-red-600 ring-1 ring-red-200",        avatar: "bg-red-100 text-red-700",     dot: "bg-red-400" },
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New", CONTACTED: "Contacted", QUALIFIED: "Qualified", CONVERTED: "Converted", LOST: "Lost",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function GetLeads() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { deleteLead, isDeleting } = useDeleteLead();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", page],
    queryFn: async () => {
      const res = await leadService.getAll(page, 10);
      const payload = res.data;
      const leads = payload?.data?.leads ?? payload?.leads ?? payload?.data ?? [];
      return { data: leads, hasMore: payload?.hasMore ?? false };
    },
  });

  const allLeads: Lead[] = data?.data ?? [];

  const leads = allLeads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.companyName?.toLowerCase().includes(q);
    const matchStatus = !activeStatus || l.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = allLeads.filter((l) => (l.status || "NEW") === s).length;
    return acc;
  }, {});

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      toast.success("Lead deleted");
      refetch();
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
        Failed to load leads. Please try again.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-400 mt-0.5">{allLeads.length} total leads</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company…"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveStatus("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeStatus === ""
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            All <span className="ml-1 opacity-60">{allLeads.length}</span>
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(activeStatus === s ? "" : s)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeStatus === s
                  ? STATUS_STYLES[s].badge + " font-semibold"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[s].dot}`} />
              {STATUS_LABELS[s]}
              <span className="opacity-60">{statusCounts[s]}</span>
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No leads found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => {
            const style = STATUS_STYLES[lead.status || "NEW"];
            return (
              <div
                key={lead._id}
                className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                {/* CARD TOP */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${style.avatar}`}>
                      {getInitials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{lead.name ?? "Unnamed"}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lead.companyName ?? "—"}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${style.badge}`}>
                    {STATUS_LABELS[lead.status || "NEW"]}

                  </span>
                  {/* CREATED AT */}
                 <span className="text-xs text-gray-400">
                  {new Date(lead.createdAt).toISOString().split("T")[0]}
                </span>
                </div>

                {/* CONTACT */}
                <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{lead.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span>{lead.phoneNumber ?? "—"}</span>
                  </div>
                </div>

                {/* NOTES */}
                {lead.notes && (
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 border-t border-gray-50 pt-3">
                    {lead.notes}
                  </p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleEdit(lead)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lead._id)}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        {(page > 1 || data?.hasMore) && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-400">Page {page}</span>
            <button
              disabled={!data?.hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <EditLeadModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        lead={selectedLead}
        onSuccess={() => {
          setIsEditOpen(false);
          refetch();
          toast.success("Lead updated successfully");
        }}
      />
    </div>
  );
}