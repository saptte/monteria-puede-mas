import { Link } from "react-router-dom";
import {
  ArrowRight,
  Handshake,
  Map as MapIcon,
  Megaphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { MEDIA } from "@/data/media";
import { cn } from "@/lib/utils";

interface EcosystemCard {
  id: string;
  eyebrow: string;
  title: string;
  claim: string;
  description: string;
  cta: string;
  path: string;
  image: string;
  icon: LucideIcon;
  accentClass: string;
}

const CARDS: EcosystemCard[] = [
  {
    id: "habla",
    eyebrow: "Montería Habla",
    title: "Tu voz cuenta.",
    claim: "Conversaciones y propuestas",
    description:
      "Participa en los temas que le importan a la ciudad, comparte tu opinión y apoya las ideas de tus vecinos.",
    cta: "Quiero participar",
    path: "/monteria-habla",
    image: MEDIA.ciudadania,
    icon: Megaphone,
    accentClass: "bg-signal",
  },
  {
    id: "hace",
    eyebrow: "Montería Hace",
    title: "Las ideas se convierten en proyectos.",
    claim: "Colaboración ciudadana",
    description:
      "Retos, voluntariados y convocatorias para pasar de la idea a la acción junto a aliados y vecinos.",
    cta: "Ver iniciativas",
    path: "/monteria-hace",
    image: MEDIA.parqueBarrio,
    icon: Handshake,
    accentClass: "bg-accent",
  },
  {
    id: "resuelve",
    eyebrow: "Montería Resuelve",
    title: "De la conversación a la acción.",
    claim: "Seguimiento y resultados",
    description:
      "Cada problema reportado tiene responsables, avance y resultados verificados con la comunidad.",
    cta: "Ver soluciones",
    path: "/monteria-resuelve",
    image: MEDIA.movilidad,
    icon: Wrench,
    accentClass: "bg-primary",
  },
  {
    id: "mapa",
    eyebrow: "El Mapa de Montería",
    title: "Entiende lo que está pasando.",
    claim: "Reportes georreferenciados",
    description:
      "Explora el mapa interactivo, filtra por tema o barrio y conoce qué está pasando en cada zona.",
    cta: "Explorar mapa",
    path: "/mapa",
    image: MEDIA.aerea,
    icon: MapIcon,
    accentClass: "bg-cat-parques",
  },
];

/** "Una plataforma. Muchas formas de participar." */
export const HomeEcosystem = () => (
  <section className="section-y bg-background" aria-labelledby="ecosistema-title">
    <div className="container-page space-y-10">
      <Reveal>
        <SectionHeader
          eyebrow="Ecosistema"
          title={
            <span id="ecosistema-title">
              Una plataforma.
              <br />
              Muchas formas de participar.
            </span>
          }
          description="Cuatro caminos, una misma ciudad: escuchar, entender, ubicar y actuar con resultados que la gente puede ver."
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, index) => (
          <Reveal key={card.id} delay={index * 0.08} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:shadow-card">
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.eyebrow}
                  crossOrigin="anonymous"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-110"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary-deep/75 via-primary-deep/10 to-transparent" />
                <span className={cn("absolute inset-x-0 top-0 h-1.5", card.accentClass)} aria-hidden />
                <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-background/95 text-primary shadow-soft">
                  <card.icon className="h-5 w-5" aria-hidden />
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="eyebrow">{card.eyebrow}</p>
                <h3 className="font-display text-[18px] leading-tight text-primary-deep">
                  {card.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <p className="mt-auto text-[11.5px] font-bold uppercase tracking-wide text-primary/70">
                  {card.claim}
                </p>
                <Button asChild variant="ghostBrand" size="sm" className="w-full justify-between">
                  <Link to={card.path}>
                    {card.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
