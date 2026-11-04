import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "@/components/common/category-badge";
import { useCommentWall, useSupportWall, useWallComments } from "@/hooks/queries/use-wall";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ReportCategoryId, WallPost } from "@/types";

const KIND_LABEL: Record<WallPost["kind"], string> = {
  tema: "Tema",
  reporte: "Reporte",
  apoyo: "Apoyo",
  comentario: "Comentario",
};

interface WallCardProps {
  post: WallPost;
}

/** Publicación del muro: se queda, se puede apoyar y comentar. */
export const WallCard = ({ post }: WallCardProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { isAuthenticated, openAuth } = useAuth();
  const { toast } = useToast();
  const support = useSupportWall();
  const comment = useCommentWall();
  const comments = useWallComments(post.id, open);
  const category = post.category as ReportCategoryId | null;

  const requireAccount = () => {
    if (isAuthenticated) return true;
    openAuth("register");
    return false;
  };

  const handleSupport = async () => {
    if (!requireAccount() || post.supportedByMe) return;
    try {
      await support.mutateAsync(post.id);
    } catch (error) {
      toast({
        title: "No se pudo registrar el apoyo",
        description: error instanceof Error ? error.message : "Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!requireAccount()) return;
    if (draft.trim().length < 2) return;
    try {
      await comment.mutateAsync({ id: post.id, body: draft });
      setDraft("");
    } catch (error) {
      toast({
        title: "No se pudo publicar el comentario",
        description: error instanceof Error ? error.message : "Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-tint px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          {KIND_LABEL[post.kind]}
        </span>
        {category ? <CategoryBadge category={category} /> : null}
        {post.barrio ? (
          <span className="text-[12px] font-semibold text-muted-foreground">{post.barrio}</span>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-bold text-primary-deep">
          {post.author}
          {post.mine ? <span className="ml-2 text-[11px] font-semibold text-primary">Tú</span> : null}
        </p>
        <time className="text-[12px] text-muted-foreground" dateTime={post.createdAt}>
          {timeAgo(post.createdAt)}
        </time>
      </div>

      {post.title ? (
        <h3 className="mt-2 font-display text-[20px] leading-tight text-primary-deep">{post.title}</h3>
      ) : null}
      <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed text-foreground/80">{post.body}</p>

      {post.kind === "reporte" && post.reference ? (
        <Link
          to={`/reportes/${post.reference}`}
          className="mt-3 inline-flex text-[13px] font-bold text-primary hover:underline"
        >
          Ver reporte {post.reference}
        </Link>
      ) : null}

      {post.kind !== "comentario" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={post.supportedByMe ? "secondary" : "outline"}
            size="sm"
            onClick={handleSupport}
            disabled={support.isPending || post.supportedByMe}
          >
            <Heart className={cn("h-4 w-4", post.supportedByMe && "fill-current text-primary")} aria-hidden />
            {post.supportedByMe ? "Apoyado" : "Apoyar"} · {post.supports}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen((value) => !value)}>
            <MessageCircle className="h-4 w-4" aria-hidden />
            Comentar · {post.comments}
          </Button>
        </div>
      ) : null}

      {open ? (
        <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
          {(comments.data ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl bg-tint/60 px-4 py-3">
              <p className="text-[12px] font-bold text-primary-deep">
                {item.author} · {timeAgo(item.createdAt)}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/80">{item.body}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escribe tu comentario…"
              maxLength={800}
              className="min-h-16"
            />
            <Button type="button" variant="sun" size="icon" onClick={handleComment} disabled={comment.isPending} aria-label="Publicar comentario">
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  );
};
