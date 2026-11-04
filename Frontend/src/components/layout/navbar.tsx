import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wordmark } from "@/components/brand/wordmark";
import { useAuth } from "@/context/auth-context";
import { useScrollCompact } from "@/hooks/use-scroll-compact";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Navbar premium sticky: se compacta con blur al hacer scroll. */
export const Navbar = () => {
  const compact = useScrollCompact(20);
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSumate = () => {
    if (isAuthenticated) {
      navigate("/mi-monteria");
      return;
    }
    openAuth("register");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-spring",
        compact
          ? "border-b border-border/70 bg-background/85 shadow-soft backdrop-blur-xl"
          : "bg-background",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between gap-4 transition-all duration-300",
          compact ? "h-16" : "h-[72px] md:h-20",
        )}
      >
        <Link to="/" className="shrink-0" aria-label="Montería Puede Más — Inicio">
          <Wordmark size={compact ? "sm" : "md"} />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors duration-300",
                  isActive ? "text-primary" : "text-foreground/70 hover:text-primary",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 -bottom-[7px] h-[3px] rounded-full bg-accent transition-all duration-300 ease-spring",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="sun"
            size={compact ? "sm" : "default"}
            className="hidden sm:inline-flex"
            onClick={handleSumate}
          >
            Súmate
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border bg-background p-1 pr-2.5 transition-colors hover:border-primary/40"
                  aria-label="Menú de mi cuenta"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-[13px] font-bold text-primary-foreground">
                    {user?.firstName.charAt(0).toUpperCase()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="text-[13px]">
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
                  <Link to="/mi-monteria">
                    <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
                    Mi Montería
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
                  <Link to="/mapa">
                    <MapPin className="mr-2 h-4 w-4" aria-hidden />
                    Ir al mapa
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl text-signal focus:text-signal"
                  onSelect={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" aria-hidden />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outlineBrand"
              size="icon"
              onClick={() => openAuth("login")}
              aria-label="Iniciar sesión o crear cuenta"
            >
              <UserRound className="h-5 w-5" aria-hidden />
            </Button>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm border-l-border/70 p-6">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="mt-2">
                <Wordmark size="md" />
              </div>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Navegación móvil">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-[52px] items-center justify-between rounded-2xl px-4 text-[15px] font-semibold transition-colors",
                        isActive
                          ? "bg-tint text-primary"
                          : "text-foreground/80 hover:bg-muted hover:text-primary",
                      )
                    }
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </NavLink>
                ))}
              </nav>
              <Button
                variant="sun"
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  setMenuOpen(false);
                  handleSumate();
                }}
              >
                Súmate a la plataforma
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
