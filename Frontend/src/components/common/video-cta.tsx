import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BrushUnderline } from "./brush-highlight";
import { cn } from "@/lib/utils";

interface VideoCtaProps {
  label: string;
  sublabel?: string;
  className?: string;
}

/** "Ver cómo funciona": abre el espacio del video institucional (2 min). */
export const VideoCta = ({ label, sublabel = "Ver video (2 min)", className }: VideoCtaProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex items-center gap-3 text-left transition-colors",
          className,
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform duration-300 ease-spring group-hover:scale-105">
          <Play className="h-4 w-4 translate-x-[1px] fill-current" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-bold leading-tight text-primary-deep">
            <BrushUnderline>{label}</BrushUnderline>
          </span>
          <span className="block text-[12px] text-muted-foreground">{sublabel}</span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl gap-3 rounded-3xl p-5 sm:p-6">
          <DialogTitle className="font-display text-xl text-primary-deep">
            Cómo funciona Montería Puede Más
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Recorrido de 2 minutos: escuchar, entender, ubicar, actuar y mostrar resultados.
          </DialogDescription>
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-brand">
            <div
              aria-hidden
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, hsl(var(--accent) / 0.6) 0 12%, transparent 13%), radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.5) 0 16%, transparent 17%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/95 text-primary shadow-elevated">
                <Play className="h-6 w-6 translate-x-[2px] fill-current" aria-hidden />
              </span>
              <p className="font-display text-lg text-background">Video institucional</p>
              <p className="max-w-xs text-[13px] text-background/80">
                Espacio listo para el video oficial de la plataforma.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
