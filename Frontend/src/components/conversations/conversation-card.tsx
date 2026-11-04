import { ArrowRight, CalendarDays, MessageCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/common/category-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

const STATUS_LABEL: Record<Conversation["status"], string> = {
  abierta: "Conversación abierta",
  "en-analisis": "En análisis",
  "con-resultados": "Con resultados",
  cerrada: "Cerrada",
};

const STATUS_CLASS: Record<Conversation["status"], string> = {
  abierta: "bg-status-ejecucion/10 text-status-ejecucion",
  "en-analisis": "bg-status-revision/15 text-status-revision",
  "con-resultados": "bg-status-resuelto/10 text-status-resuelto",
  cerrada: "bg-status-recibido/10 text-status-recibido",
};

interface ConversationCardProps {
  conversation: Conversation;
  onParticipate?: (conversation: Conversation) => void;
  className?: string;
}

/** Card de conversación ciudadana (Montería Habla). */
export const ConversationCard = ({
  conversation,
  onParticipate,
  className,
}: ConversationCardProps) => (
  <article
    className={cn(
      "group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-card",
      className,
    )}
  >
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
      <img
        src={conversation.image}
        alt={conversation.question}
        crossOrigin="anonymous"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
      />
      <span
        className={cn(
          "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur",
          STATUS_CLASS[conversation.status],
        )}
      >
        {STATUS_LABEL[conversation.status]}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-3 p-5">
      <CategoryBadge category={conversation.category} />
      <h3 className="font-display text-[18px] leading-tight text-primary-deep">
        {conversation.question}
      </h3>
      <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
        {conversation.summary}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
          {conversation.participants} participantes
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5 text-primary" aria-hidden />
          {conversation.comments} comentarios
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden />
          {formatDate(conversation.createdAt, { day: undefined, month: "short" })}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {conversation.barrios.slice(0, 3).map((barrio) => (
          <Badge key={barrio} variant="tint" className="normal-case tracking-normal">
            {barrio}
          </Badge>
        ))}
        {conversation.barrios.length > 3 ? (
          <Badge variant="outlineBrand" className="normal-case tracking-normal">
            +{conversation.barrios.length - 3} zonas
          </Badge>
        ) : null}
      </div>

      <Button
        variant="outlineBrand"
        size="sm"
        className="mt-auto w-full"
        onClick={() => onParticipate?.(conversation)}
      >
        Participar
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  </article>
);
