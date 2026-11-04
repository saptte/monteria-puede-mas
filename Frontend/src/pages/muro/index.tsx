import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/common/page-hero";
import { FilterChip } from "@/components/common/filter-chip";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { WallCard } from "@/components/wall/wall-card";
import { CATEGORIES } from "@/data/categories";
import { MEDIA } from "@/data/media";
import { usePublishWall, useWall } from "@/hooks/queries/use-wall";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { WallKind } from "@/types";

const FILTERS: { id: WallKind | "todos"; label: string }[] = [
  { id: "todos", label: "Todo" },
  { id: "tema", label: "Temas" },
  { id: "reporte", label: "Reportes" },
  { id: "apoyo", label: "Apoyos" },
];

/** Muro público: lo que publica la ciudadanía se queda aquí. */
const MuroPage = () => {
  const [filter, setFilter] = useState<WallKind | "todos">("todos");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [barrio, setBarrio] = useState("");
  const { isAuthenticated, openAuth } = useAuth();
  const { toast } = useToast();
  const wall = useWall(filter === "todos" ? undefined : filter);
  const publish = usePublishWall();

  const handlePublish = async () => {
    if (!isAuthenticated) {
      openAuth("register");
      return;
    }
    try {
      await publish.mutateAsync({
        title,
        body,
        category: category || undefined,
        barrio: barrio || undefined,
      });
      setTitle("");
      setBody("");
      setCategory("");
      setBarrio("");
      setFilter("todos");
      toast({
        title: "Quedó en el muro",
        description: "Tu tema ya lo puede ver quien entre a la plataforma.",
      });
    } catch (error) {
      toast({
        title: "No se pudo publicar",
        description: error instanceof Error ? error.message : "Revisa el título y el mensaje.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="El muro"
        title={
          <>
            Lo que publicas
            <br />
            se queda en Montería.
          </>
        }
        accent="Tu voz queda aquí."
        description="Temas, reportes, apoyos y comentarios de quienes se registran. Entra con tu cuenta y publica para la ciudad."
        image={MEDIA.ciudadania}
        imageAlt="Ciudadanía de Montería conversando"
      />

      <section className="section-y bg-background pb-28" aria-labelledby="muro-title">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <form
            className="h-fit space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              void handlePublish();
            }}
          >
            <div>
              <h2 id="muro-title" className="font-display text-[22px] text-primary-deep">
                Publicar en el muro
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Solo las personas registradas pueden publicar. El tema queda visible para toda la ciudad.
              </p>
            </div>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Título del tema"
              maxLength={180}
              aria-label="Título del tema"
            />
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Cuéntanos la idea, el problema o la propuesta…"
              maxLength={2000}
              aria-label="Mensaje del tema"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Temática"
                className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground"
              >
                <option value="">Temática</option>
                {CATEGORIES.filter((item) => item.id !== "otro").map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.short}
                  </option>
                ))}
              </select>
              <Input
                value={barrio}
                onChange={(event) => setBarrio(event.target.value)}
                placeholder="Barrio"
                maxLength={120}
                aria-label="Barrio"
              />
            </div>
            <Button type="submit" variant="sun" size="lg" className="w-full" disabled={publish.isPending}>
              {isAuthenticated ? "Publicar" : "Regístrate para publicar"}
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>

          <div className="space-y-4">
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((item) => (
                <FilterChip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
                  {item.label}
                </FilterChip>
              ))}
            </div>

            {wall.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-3xl" />
                ))}
              </div>
            ) : wall.data?.length ? (
              wall.data.map((post) => <WallCard key={post.id} post={post} />)
            ) : (
              <EmptyState
                title="El muro está esperando la primera publicación"
                description="Regístrate y publica un tema. Los reportes y los apoyos también quedan aquí."
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MuroPage;
