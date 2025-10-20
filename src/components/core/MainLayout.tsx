import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from './Toaster';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl p-4">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
