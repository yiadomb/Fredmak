"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/residents", label: "Residents" },
  { href: "/dashboard/rooms", label: "Rooms" },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/maintenance", label: "Maintenance" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Fredmak Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-3 py-2 transition font-medium ${isActive ? "bg-white text-blue-900 font-bold" : "hover:bg-blue-700"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <span className="font-semibold text-lg">Management Area</span>
        </header>
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
} 