import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessagesSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { FilterChip } from "@/components/common/filter-chip";
import { SearchBar } from "@/components/common/search-bar";
import { EmptyState } from "@/components/common/empty-state";
import { InstitutionalBanner } from "@/components/common/institutional-banner";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ParticipateDialog } from "./participate-dialog";
import { CATEGORIES } from "@/data/categories";
import { MEDIA } from "@/data/media";
import { useConversations } from "@/hooks/queries/use-content";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import type { Conversation, ConversationStatus, ReportCategoryId } from "@/types";

const STATUS_FILTERS: { id: ConversationStatus | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "abierta", label: "Abiertas" },
  { id: "en-analisis", label: "En análisis" },
  { id: "con-resultados", label: "Con resultados" },
];

const TOPIC_FILTERS: (ReportCategoryId | "todos")[] = [
  "todos",
  "movilidad",
  "parques",
  "economia",
  "agua",
  "ideas",
  "basuras",
  "seguridad",
];

/** Montería Habla: conversaciones, opiniones y propuestas ciudadanas. */
const MonteriaHabla = () => {
  const [status, setStatus] = useState<ConversationStatus | "todas">("todas");
  const [topic, setTopic] = useState<ReportCategoryId | "todos">("todos");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Conversation | null>(null);
  const { isAuthenticated, openAuth } = useAuth();
  const navigate = useNavigate();

  const filters = useMemo(
    () => ({
      status: status === "todas" ? undefined : [status],
      categories: topic === "todos" ? undefined : [topic],
      query: query || undefined,
    }),
    [query, status, topic],
  );

  const { data: conversations = [], isLoading } = useConversations(filters);

  const handleParticipate = (conversation: Conversation) => {
    if (!isAuthenticated) {
      openAuth("register");
      return;
    }
    setActive(conversation);
  };

  const handleSumate = () => {
    navigate("/muro");
  };

  return (
    <>
      <PageHero
        eyebrow="Montería Habla"
        title={
          <>
            Montería habla.
            <br />
            Nosotros escuchamos.
          </>
        }
        accent="Tu voz mueve la ciudad."
        description="Un espacio abierto para conversar sobre lo que necesita Montería: movilidad, espacio público, juventud, cultura, ambiente y convivencia. Aquí tu opinión se convierte en propuesta."
        image={MEDIA.ciudadania}
        imageAlt="Ciudadanía de Montería participando en un encuentro comunitario"
      >
        <Button variant="sun" size="xl" onClick={handleSumate}>
          Quiero participar
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button variant="outlineBrand" size="xl" asChild>
          <a href="#conversaciones">
            Ver temas abiertos
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Button>
      </PageHero>

      <section className="section-y bg-background" aria-labelledby="conversaciones-title">
        <div className="container-page space-y-8">
          <Reveal>
            <SectionHeader
              eyebrow="Conversaciones ciudadanas"
              title={<span id="conversaciones-title">Temas que hoy mueven a Montería</span>}
              description="Cada conversación reúne participantes, comentarios y barrios involucrados."
            />
          </Reveal>

          <div className="space-y-4">
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
              {STATUS_FILTERS.map((filter) => (
                <FilterChip
                  key={filter.id}
                  active={status === filter.id}
                  onClick={() => setStatus(filter.id)}
                >
                  {filter.label}
                </FilterChip>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                {TOPIC_FILTERS.map((filter) => {
                  const label =
                    filter === "todos"
                      ? "Todas las temáticas"
                      : CATEGORIES.find((category) => category.id === filter)?.short ?? filter;
                  return (
                    <FilterChip
                      key={filter}
                      active={topic === filter}
                      onClick={() => setTopic(filter)}
                    >
                      {label}
                    </FilterChip>
                  );
                })}
              </div>
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Buscar conversación"
                ariaLabel="Buscar conversaciones ciudadanas"
                className="lg:w-80"
              />
            </div>
          </div>

          <div id="conversaciones">
            {isLoading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-[420px] w-full" />
                ))}
              </div>
            ) : conversations.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {conversations.map((conversation, index) => (
                  <Reveal key={conversation.id} delay={index * 0.05} className="h-full">
                    <ConversationCard
                      conversation={conversation}
                      onParticipate={handleParticipate}
                      className="h-full"
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No encontramos conversaciones con esos filtros"
                description="Cambia la temática, el estado o limpia la búsqueda para ver todas las conversaciones abiertas de Montería."
                action={{ label: "Limpiar filtros", onClick: () => {
                  setStatus("todas");
                  setTopic("todos");
                  setQuery("");
                } }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="pb-16 bg-background" aria-label="Cómo participar">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Escucha y opina",
                description: "Entra a la conversación que te interesa y comparte tu experiencia.",
                icon: MessagesSquare,
              },
              {
                title: "Propón ideas",
                description: "Tus propuestas se apoyan entre vecinos y llegan a los proyectos.",
                icon: Sparkles,
              },
              {
                title: "Sigue los resultados",
                description: "Cada conversación termina en acciones concretas y verificables.",
                icon: ArrowRight,
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tint text-primary">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className={cn("font-display text-[16px] text-primary-deep")}>{item.title}</p>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <InstitutionalBanner onPrimary={handleSumate} primaryLabel="Quiero participar" />

      <ParticipateDialog conversation={active} onOpenChange={(open) => !open && setActive(null)} />
    </>
  );
};

export default MonteriaHabla;
