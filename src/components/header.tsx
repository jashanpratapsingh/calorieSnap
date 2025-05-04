import { Utensils } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 transition-smooth hover:opacity-90">
          <div className="rounded-lg bg-primary/10 p-2">
            <Utensils className="h-6 w-6 text-primary" />
          </div>
          <span className="font-semibold text-xl tracking-tight">CalorieSnap</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Future navigation items can go here */}
        </div>
      </div>
    </header>
  );
}
