'use client';

import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { PreviewPanel } from '@/components/dashboard/PreviewPanel';
import { DashboardProvider } from '@/context/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          {children}
        </main>
        <PreviewPanel />
      </div>
    </DashboardProvider>
  );
}
