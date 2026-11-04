import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InstitutionalBannerProps {
  className?: string;
  onPrimary?: () => void;
  primaryLabel?: string;
}

/**
 * Banda institucional azul → amarillo con textura de hojas de palma.
 * Es la pieza de cierre de home, mapa y páginas internas
 * ("Montería no es pobre, está desordenada").
 */
export const InstitutionalBanner = ({
  className,
  onPrimary,
  primaryLabel = "Quiero ser parte",
}: InstitutionalBannerProps) => (
  <section
    className={cn("relative overflow-hidden bg-primary-deep", className)}
    aria-labelledby="banner-institucional"
  >
    {/* Mitad amarilla: en móvil abajo, en desktop a la derecha con corte diagonal */}
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-br from-accent to-[hsl(45_100%_60%)] lg:inset-y-0 lg:left-[50%] lg:top-0"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    />
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 top-1/2 bg-primary-deep/0 lg:hidden"
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.18] lg:hidden"
      style={{ backgroundImage: "linear-gradient(180deg, transparent 48%, hsl(var(--primary-deep) / 0.25) 49%)" }}
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.14]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 4% 140%, hsl(var(--primary-deep)) 0 24%, transparent 25%), radial-gradient(circle at 99% -25%, hsl(var(--primary-deep)) 0 22%, transparent 23%)",
      }}
    />

    <div className="container-page relative grid gap-8 py-12 md:py-14 lg:grid-cols-2 lg:items-center lg:gap-10">
      <div className="space-y-4">
        <h2
          id="banner-institucional"
          className="text-[30px] leading-[1.02] text-background sm:text-[38px] lg:text-[46px]"
        >
          MONTERÍA <span className="text-accent">NO ES POBRE.</span>
          <br />
          ESTÁ <span className="text-accent">DESORDENADA.</span>
        </h2>
        <p className="max-w-md text-[15px] leading-relaxed text-background/85">
          Una ciudad con más orden, oportunidades y futuro es posible, y empieza con la
          participación de su gente.
        </p>
      </div>

      <div className="rounded-3xl bg-background/12 p-6 backdrop-blur-sm lg:bg-transparent lg:p-0 lg:backdrop-blur-0 lg:pl-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-deep/15 text-primary-deep lg:bg-primary-deep/12">
            <Users className="h-6 w-6" aria-hidden />
          </span>
          <div className="space-y-2">
            <p className="font-display text-[20px] leading-tight text-primary-deep sm:text-[22px]">
              Súmate a una ciudad que puede más.
            </p>
            <p className="text-[14px] leading-relaxed text-primary-deep/80">
              Tu voz, tus ideas y tu participación también construyen Montería.
            </p>
          </div>
        </div>
        <Button
          variant="brand"
          size="lg"
          className="mt-5 w-full bg-primary-deep text-background hover:bg-primary-deep/90 sm:w-auto"
          onClick={onPrimary}
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  </section>
);
