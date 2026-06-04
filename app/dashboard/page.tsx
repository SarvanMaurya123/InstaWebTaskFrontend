"use client";

import { useLeadStats } from "@/hooks/leads/useLeadStats";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, TrendingUp, Target, Award, ArrowUpRight } from "lucide-react";

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

const STATUS_META: Record<
  LeadStatus,
  { color: string; tailwind: string; bg: string; text: string }
> = {
  NEW: {
    color: "#3b82f6",
    tailwind: "bg-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  CONTACTED: {
    color: "#f59e0b",
    tailwind: "bg-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  QUALIFIED: {
    color: "#8b5cf6",
    tailwind: "bg-purple-400",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  CONVERTED: {
    color: "#22c55e",
    tailwind: "bg-green-400",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  LOST: {
    color: "#ef4444",
    tailwind: "bg-red-400",
    bg: "bg-red-50",
    text: "text-red-600",
  },
};

const STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
];

export default function DashboardPage() {
  const { data, isLoading } = useLeadStats();

  // 🔥 normalize backend data safely
  const statusStats: Record<string, number> =
    Array.isArray(data?.statusStats)
      ? data.statusStats.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      : data?.statusStats || {};

  const chartData = STATUS_ORDER.map((s) => ({
    status: s,
    count: statusStats?.[s] ?? 0,
  }));

  const total = data?.totalLeads ?? 0;
  const converted = statusStats["CONVERTED"] ?? 0;
  const qualified = statusStats["QUALIFIED"] ?? 0;

  const conversionRate =
    total > 0 ? ((converted / total) * 100).toFixed(1) : "0.0";

  const STAT_CARDS = [
    {
      label: "Total Leads",
      value: total,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Converted",
      value: converted,
      icon: Award,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Qualified",
      value: qualified,
      icon: Target,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border rounded-2xl p-5 animate-pulse"
                  />
                ))
            : STAT_CARDS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition"
                  >
                    <div className="flex justify-between mb-4">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> live
                      </span>
                    </div>
                    <p className="text-2xl font-semibold">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                );
              })}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PIE */}
          <div className="bg-white border rounded-2xl p-5">
            <p className="font-semibold">Lead Distribution</p>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={80}
                >
                  {chartData.map((e) => (
                    <Cell
                      key={e.status}
                      fill={STATUS_META[e.status]?.color || "#ccc"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR */}
          <div className="bg-white border rounded-2xl p-5">
            <p className="font-semibold">Status Comparison</p>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {chartData.map((e) => (
                    <Cell
                      key={e.status}
                      fill={STATUS_META[e.status]?.color || "#ccc"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}