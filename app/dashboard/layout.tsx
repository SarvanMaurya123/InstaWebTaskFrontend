'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Contact,
  Settings,
  Menu,
  Upload,
} from 'lucide-react';
import { useLogout } from '@/hooks/auth/useLogout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const { mutate, isPending } = useLogout();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm transition-all duration-300
        ${open ? 'w-64' : 'w-20'} flex flex-col`}
      >
        {/* Top */}
        <div className="p-4 border-b flex items-center justify-between">
          {open && (
            <h1 className="font-bold text-orange-600">LeadCRM</h1>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="text-gray-600 hover:text-black"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-2">

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700"
          >
            <LayoutDashboard size={20} />
            {open && <span>Dashboard</span>}
          </Link>
          <Link
            href="/dashboard/addleads"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700"
          >
            <Upload size={20} />
            {open && <span>Add Leads</span>}
          </Link>

          <Link
            href="/dashboard/leads"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700"
          >
            <Users size={20} />
            {open && <span>Leads</span>}
          </Link>

         

        </nav>

        {/* Bottom logout */}
        <div className="p-3 border-t text-sm text-gray-500">
          <button
      onClick={() => mutate()}
      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded w-full text-left"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
           
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}