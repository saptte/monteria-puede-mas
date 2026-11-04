import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

/** Buscador accesible con icono y limpieza rápida. */
export const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar por barrio, dirección o número de caso",
  className,
  ariaLabel = "Buscar reportes",
}: SearchBarProps) => (
  <div className={cn("relative", className)}>
    <Search
      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden
    />
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="pl-11 pr-11"
    />
    {value ? (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Limpiar búsqueda"
        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    ) : null}
  </div>
);
