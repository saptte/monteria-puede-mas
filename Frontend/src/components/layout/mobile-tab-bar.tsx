import { NavLink } from "react-router-dom";
import { MOBILE_TABS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Navegación inferior móvil. El botón "Reportar" sobresale en amarillo
 * y es el acceso más rápido del ciudadano.
 */
export const MobileTabBar = () => (
  <nav
    aria-label="Navegación inferior"
    className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-xl lg:hidden"
  >
    <ul className="mx-auto flex max-w-lg items-end justify-between px-3 pt-2">
      {MOBILE_TABS.map((tab) => {
        const isReport = tab.highlight;
        const Icon = tab.icon;
        return (
          <li key={tab.path} className="flex-1">
            <NavLink
              to={tab.path}
              end={tab.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) =>
                isReport ? (
                  <>
                    <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary-deep shadow-sun transition-transform duration-300 ease-spring hover:scale-105">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="text-[11px] font-bold text-primary-deep">{tab.label}</span>
                  </>
                ) : (
                  <>
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} aria-hidden />
                    <span>{tab.label}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "h-1 w-1 rounded-full bg-accent transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </>
                )
              }
            </NavLink>
          </li>
        );
      })}
    </ul>
  </nav>
);
