import { Toaster } from './Toaster';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { MobileTabBar } from './MobileTabBar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <StatusBar />
      <main className="mx-auto max-w-7xl p-4 pt-14 pb-16 md:pb-4 md:pl-[88px]">
        {children}
      </main>
      <MobileTabBar />
      <Toaster />
    </div>
  );
}
