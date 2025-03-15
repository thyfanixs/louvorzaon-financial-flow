
import { Navbar } from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen bg-slate-50">
      <Navbar />
      <main 
        className={`transition-all duration-300 ${
          isMobile ? "pt-20 px-4 pb-6" : "md:pl-64 p-8"
        }`}
      >
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
