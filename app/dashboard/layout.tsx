'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Upload,
  Menu,
} from 'lucide-react';
import { useLogout } from '@/hooks/auth/useLogout';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/auth/useMe';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  const { mutate, isPending } = useLogout();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useMe();

  /**
   * 🚨 AUTH GUARD (ONLY ONE RESPONSIBILITY)
   */
  useEffect(() => {
    if (isLoading) return;

    if (!user || isError) {
      router.replace("/login");
    }
  }, [user, isLoading, isError, router]);

  /**
   * 🔥 BLOCK UI UNTIL AUTH IS RESOLVED
   */
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // prevent flash before redirect
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm transition-all duration-300
        ${open ? 'w-64' : 'w-20'} flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {open && (
            <h1 className="font-bold text-orange-600">LeadCRM</h1>
          )}

          <button onClick={() => setOpen(!open)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          <Link href="/dashboard" className="flex gap-3 px-3 py-2 hover:bg-orange-50">
            <LayoutDashboard size={20} />
            {open && <span>Dashboard</span>}
          </Link>

          <Link href="/dashboard/addleads" className="flex gap-3 px-3 py-2 hover:bg-orange-50">
            <Upload size={20} />
            {open && <span>Add Leads</span>}
          </Link>

          <Link href="/dashboard/leads" className="flex gap-3 px-3 py-2 hover:bg-orange-50">
            <Users size={20} />
            {open && <span>Leads</span>}
          </Link>
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={() => mutate()}
            className="text-red-600 hover:bg-red-50 px-3 py-2 w-full text-left"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}