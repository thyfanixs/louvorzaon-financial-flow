
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  BarChart3, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/",
  },
  {
    label: "Transações",
    icon: <ArrowRightLeft className="h-5 w-5" />,
    href: "/transactions",
  },
  {
    label: "Relatórios",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/reports",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-white p-4 fixed">
        <div className="mb-8 flex items-center justify-center py-4">
          <h1 className="text-2xl font-bold text-primary">Louvorzão</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t pt-4 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm font-medium text-muted-foreground hover:bg-muted"
            onClick={() => handleNavigation("/settings")}
          >
            <Settings className="mr-3 h-4 w-4" />
            Configurações
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="ml-3 text-xl font-bold text-primary">Louvorzão</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300 overflow-hidden">
          <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-white p-4 animate-in slide-in-from-left duration-300">
            <div className="mb-8 flex items-center justify-between py-4">
              <h1 className="text-xl font-bold text-primary">Louvorzão</h1>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={toggleMobileMenu}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="border-t pt-4 mt-8">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm font-medium text-muted-foreground hover:bg-muted"
                onClick={() => handleNavigation("/settings")}
              >
                <Settings className="mr-3 h-4 w-4" />
                Configurações
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
