import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UsefulnessFeedbackProps {
  caseNumber: string;
  className?: string;
}

/** "¿Te pareció útil esta respuesta?" — retroalimentación del ciudadano. */
export const UsefulnessFeedback = ({ caseNumber, className }: UsefulnessFeedbackProps) => {
  const [answer, setAnswer] = useState<"si" | "no" | null>(null);
  const { toast } = useToast();

  const respond = (value: "si" | "no") => {
    setAnswer(value);
    toast({
      title: value === "si" ? "¡Gracias por tu respuesta!" : "Gracias, lo tendremos en cuenta",
      description:
        value === "si"
          ? `Nos alegra que la respuesta del caso ${caseNumber} fuera clara.`
          : `Vamos a revisar la respuesta del caso ${caseNumber} para mejorarla.`,
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border border-border/70 bg-tint/50 p-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="font-display text-[15px] text-primary-deep">
        ¿Te pareció útil esta respuesta?
      </p>
      <div className="flex gap-2">
        {[
          { value: "si" as const, label: "Sí", Icon: ThumbsUp },
          { value: "no" as const, label: "No", Icon: ThumbsDown },
        ].map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => respond(value)}
            aria-pressed={answer === value}
            className={cn(
              "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[13px] font-bold transition-all duration-300",
              answer === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:text-primary",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
