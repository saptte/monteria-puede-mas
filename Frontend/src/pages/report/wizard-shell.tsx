import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/common/progress-meter";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/utils";

interface WizardSuccessProps {
  caseNumber: string;
  reportId: string;
  barrio: string;
  onReset: () => void;
}

/** Paso 6 — Confirmación del reporte recibido. */
export const WizardSuccess = ({ caseNumber, reportId, barrio, onReset }: WizardSuccessProps) => (
  <div className="flex flex-col items-center gap-5 py-6 text-center">
    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-status-resuelto/10 text-status-resuelto">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-status-resuelto/30 animate-pulse-ring"
      />
      <CheckCircle2 className="relative h-10 w-10" aria-hidden />
    </span>

    <div className="space-y-2">
      <h2 className="font-display text-[26px] leading-tight text-primary-deep">Reporte recibido</h2>
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Tu reporte ya hace parte del mapa de Montería. Te avisaremos cada vez que cambie de estado.
      </p>
    </div>

    <div className="w-full max-w-md space-y-3 rounded-3xl border border-border/70 bg-tint/50 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Número de caso
      </p>
      <p className="font-display text-[26px] tracking-wide text-primary-deep">{caseNumber}</p>
      <p className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
        Barrio {barrio || "por confirmar"}
      </p>
    </div>

    <Wordmark size="sm" className="items-center" />

    <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <Button asChild variant="sun" size="lg" className="flex-1">
        <Link to={`/reportes/${reportId}`}>
          Ver mi reporte
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
      <Button asChild variant="outlineBrand" size="lg" className="flex-1">
        <Link to="/mapa">Volver al mapa</Link>
      </Button>
    </div>

    <button
      type="button"
      onClick={onReset}
      className="text-[12.5px] font-semibold text-primary underline-offset-2 hover:underline"
    >
      Reportar otra situación
    </button>
  </div>
);

interface WizardShellProps {
  step: number;
  totalSteps: number;
  stepTitle: string;
  stepHelper: string;
  children: React.ReactNode;
  canContinue: boolean;
  submitting: boolean;
  onNext: () => void;
  onBack: () => void;
  isLastInputStep: boolean;
}

/** Marco visual del flujo de reporte con stepper y barra de acciones. */
export const WizardShell = ({
  step,
  totalSteps,
  stepTitle,
  stepHelper,
  children,
  canContinue,
  submitting,
  onNext,
  onBack,
  isLastInputStep,
}: WizardShellProps) => (
  <div className="container-page max-w-4xl py-8 lg:py-12">
    <div className="mb-6 space-y-3">
      <p className="eyebrow">Reportar un problema</p>
      <h1 className="text-[28px] leading-tight text-primary-deep sm:text-[34px]">
        {stepTitle}
      </h1>
      <p className="text-[14px] text-muted-foreground">{stepHelper}</p>
      <ProgressMeter
        value={(step / totalSteps) * 100}
        label={`Paso ${step} de ${totalSteps}`}
        showValue={false}
      />
    </div>

    <div className="card-soft p-5 sm:p-7">{children}</div>

    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onBack}
        disabled={step === 1 || submitting}
        className={cn(step === 1 && "invisible")}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Atrás
      </Button>

      {isLastInputStep ? (
        <Button
          type="button"
          variant="sun"
          size="xl"
          onClick={onNext}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
          Enviar reporte
        </Button>
      ) : (
        <Button
          type="button"
          variant="brand"
          size="xl"
          onClick={onNext}
          disabled={submitting || !canContinue}
          className="w-full sm:w-auto"
        >
          Continuar
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      )}
    </div>
  </div>
);
