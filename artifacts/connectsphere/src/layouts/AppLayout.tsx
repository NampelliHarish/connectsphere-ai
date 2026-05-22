import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIAssistant } from '@/components/common/AIAssistant';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <AIAssistant />
    </div>
  );
}
