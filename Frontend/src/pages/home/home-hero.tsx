import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrushHighlight } from "@/components/common/brush-highlight";
import { VideoCta } from "@/components/common/video-cta";
import { AnimatedNumber } from "@/components/common/animated-number";
import { MEDIA } from "@/data/media";
import { KPIS } from "@/data/stats.mock";

/** Hero editorial del home: contenido a la izquierda, Montería a la derecha. */
export const HomeHero = () => (
  <section className="relative overflow-hidden bg-background" aria-labelledby="home-hero-title">
    <div className="container-page relative grid items-center gap-10 py-10 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:gap-4 lg:py-16">
      <div className="relative z-10 space-y-6">
        <p className="eyebrow">Montería Puede Más</p>

        <h1
          id="home-hero-title"
          className="text-[38px] leading-[0.96] text-primary-deep sm:text-[52px] lg:text-[60px]"
        >
          Tu voz puede
          <br />
          mover la ciudad.
        </h1>

        <p className="text-[27px] leading-tight sm:text-[34px]">
          <BrushHighlight>
            <span className="script-accent">Juntos podemos más.</span>
          </BrushHighlight>
        </p>

        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Una plataforma para conversar, proponer, reportar y construir soluciones para Montería.
          Aquí lo que pasa en tu barrio se ve, se entiende y se convierte en acción.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="sun" size="xl">
            <Link to="/reportar">
              Participa ahora
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outlineBrand" size="xl">
            <Link to="/mapa">
              Explora el mapa
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <VideoCta label="Conoce cómo funciona Montería Puede Más" className="pt-1" />
      </div>

      <div className="relative lg:-mr-8">
        <div className="relative overflow-hidden rounded-[2.25rem] shadow-card lg:rounded-l-[3.5rem]">
          <img
            src={MEDIA.catedral}
            alt="Catedral de Montería rodeada de palmas al atardecer"
            crossOrigin="anonymous"
            className="h-[320px] w-full object-cover sm:h-[440px] lg:h-[560px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden lg:block"
            style={{ backgroundImage: "var(--gradient-hero-fade)" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary-deep/55 to-transparent lg:hidden"
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 lg:bottom-8 lg:left-8 lg:right-auto">
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/95 px-4 py-3 shadow-card backdrop-blur">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-primary">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-display text-[22px] leading-none text-primary-deep">
                <AnimatedNumber value={KPIS.reports} />
              </p>
              <p className="text-[11.5px] font-semibold text-muted-foreground">
                reportes en el mapa
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 shadow-sun">
            <Sparkles className="h-4 w-4 text-primary-deep" aria-hidden />
            <p className="text-[12px] font-bold text-primary-deep">
              Ciudadanía activa en {KPIS.barrios} barrios
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
