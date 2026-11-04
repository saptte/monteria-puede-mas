import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "@/components/common/category-badge";
import { wallService } from "@/services/wall.service";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";
import type { Conversation } from "@/types";

interface ParticipateDialogProps {
  conversation: Conversation | null;
  onOpenChange: (open: boolean) => void;
}

/** Participación en una conversación ciudadana. */
export const ParticipateDialog = ({ conversation, onOpenChange }: ParticipateDialogProps) => {
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submit = async () => {
    if (!conversation) return;
    if (comment.trim().length < 10) {
      toast({
        title: "Cuéntanos un poco más",
        description: "Escribe al menos unas palabras para publicar tu aporte.",
        variant: "destructive",
      });
      return;
    }
    setPending(true);
    try {
      await wallService.publish({
        title: conversation.question.slice(0, 180),
        body: comment.trim(),
        category: conversation.category === "otro" ? undefined : conversation.category,
      });
      await queryClient.invalidateQueries({ queryKey: ["wall"] });
      toast({
        title: "Tu aporte quedó en el muro",
        description: "Ya lo puede ver quien entre a El Muro.",
      });
      setComment("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "No se pudo publicar",
        description: error instanceof Error ? error.message : "Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={Boolean(conversation)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl border-border/70 p-6">
        {conversation ? (
          <>
            <div className="space-y-3">
              <CategoryBadge category={conversation.category} size="md" />
              <DialogTitle className="font-display text-[22px] leading-tight text-primary-deep">
                {conversation.question}
              </DialogTitle>
              <DialogDescription className="text-[14px] leading-relaxed text-muted-foreground">
                {conversation.summary}
              </DialogDescription>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-tint/70 p-4">
                <p className="font-display text-[20px] text-primary-deep">
                  {conversation.participants}
                </p>
                <p className="text-[12px] text-muted-foreground">participantes</p>
              </div>
              <div className="rounded-2xl bg-tint/70 p-4">
                <p className="font-display text-[20px] text-primary-deep">
                  {conversation.comments}
                </p>
                <p className="text-[12px] text-muted-foreground">comentarios</p>
              </div>
              <div className="rounded-2xl bg-tint/70 p-4">
                <p className="font-display text-[20px] text-primary-deep">
                  {conversation.barrios.length}
                </p>
                <p className="text-[12px] text-muted-foreground">zonas involucradas</p>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary/70">
                Puntos que ya coinciden
              </p>
              <ul className="space-y-1.5">
                {conversation.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-[13.5px] text-foreground/80">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <label htmlFor="aporte" className="text-[13px] font-bold text-primary-deep">
                Escribe tu aporte
              </label>
              <Textarea
                id="aporte"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Cuéntanos tu idea, tu experiencia o una propuesta para este tema…"
                maxLength={600}
              />
              <p className="text-right text-[11.5px] text-muted-foreground">
                {comment.length}/600
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-muted-foreground">
                Abierta desde {formatDate(conversation.createdAt)}
              </p>
              <Button variant="sun" size="lg" onClick={() => void submit()} disabled={pending}>
                Publicar aporte
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
