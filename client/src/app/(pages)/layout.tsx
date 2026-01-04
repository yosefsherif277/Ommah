// src/app/layout.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./../components/sidebar";
import Loading from "./../components/loading";
import { dummyUserData } from "../assets/assets";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = dummyUserData;
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/login/factor-one") {
    return <>{children}</>;
  }
  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-slate-50">
        {children}
      </div>

      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
}
