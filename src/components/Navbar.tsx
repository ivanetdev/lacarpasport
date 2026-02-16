import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Dumbbell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/horarios", label: "Horarios" },
  { to: "/profesores", label: "Profesores" },
  { to: "/blog", label: "Blog" },
  { to: "/info", label: "Info & Ubicación" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-7 w-7 text-foreground" />
          <span className="font-heading text-xl tracking-wider">LA CARPA SPORTS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === l.to ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                <User className="h-4 w-4 mr-1" /> Mi Área
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                  Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              Acceder
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === l.to ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/dashboard"); setOpen(false); }}>
                Mi Área
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/admin"); setOpen(false); }}>
                  Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" className="w-full" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button size="sm" className="w-full" onClick={() => { navigate("/auth"); setOpen(false); }}>
              Acceder
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
