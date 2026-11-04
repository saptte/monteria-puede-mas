import { useCallback, useState } from "react";
import { reportsService } from "@/services/reports.service";
import { MAP_DEFAULT_POINT } from "@/services/map-provider";
import {
  stepCategorySchema,
  stepConsentSchema,
  stepDescriptionSchema,
  stepEvidenceSchema,
  stepLocationSchema,
} from "@/lib/validation";
import type { GeoPoint, Report, ReportCategoryId } from "@/types";

export interface WizardDraft {
  category?: ReportCategoryId;
  title: string;
  description: string;
  barrio: string;
  address: string;
  coords: GeoPoint;
  photos: string[];
  consent: boolean;
}

export const WIZARD_STEPS = [
  { id: 1, title: "¿Qué está pasando?", helper: "Elige el tema de tu reporte" },
  { id: 2, title: "Cuéntanos qué ocurre", helper: "Un título claro y una descripción breve" },
  { id: 3, title: "¿Dónde está pasando?", helper: "Ubica el punto exacto en el mapa" },
  { id: 4, title: "Agrega evidencia", helper: "Fotos o videos del lugar" },
  { id: 5, title: "Datos y autorización", helper: "Revisa y autoriza el tratamiento de datos" },
  { id: 6, title: "Reporte recibido", helper: "Tu caso ya hace parte del mapa" },
] as const;

const emptyDraft: WizardDraft = {
  title: "",
  description: "",
  barrio: "",
  address: "",
  coords: MAP_DEFAULT_POINT,
  photos: [],
  consent: false,
};

/** Máquina de estados del flujo de reporte, con validación por paso. */
export function useReportWizard() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WizardDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Report | null>(null);

  const update = useCallback((patch: Partial<WizardDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors({});
  }, []);

  const validate = (currentStep = step): boolean => {
    let issues: { path: PropertyKey[]; message: string }[] = [];

    switch (currentStep) {
      case 1: {
        const result = stepCategorySchema.safeParse({ category: draft.category ?? "" });
        if (!result.success) issues = result.error.issues;
        break;
      }
      case 2: {
        const result = stepDescriptionSchema.safeParse({
          title: draft.title,
          description: draft.description,
        });
        if (!result.success) issues = result.error.issues;
        break;
      }
      case 3: {
        const result = stepLocationSchema.safeParse({
          barrio: draft.barrio,
          address: draft.address,
          lat: draft.coords.lat,
          lng: draft.coords.lng,
        });
        if (!result.success) issues = result.error.issues;
        break;
      }
      case 4: {
        const result = stepEvidenceSchema.safeParse({ photos: draft.photos });
        if (!result.success) issues = result.error.issues;
        break;
      }
      case 5: {
        const result = stepConsentSchema.safeParse({ consent: draft.consent });
        if (!result.success) issues = result.error.issues;
        break;
      }
      default:
        issues = [];
    }

    if (!issues.length) {
      setErrors({});
      return true;
    }

    const nextErrors: Record<string, string> = {};
    for (const issue of issues) {
      const key = String(issue.path[0] ?? "form");
      nextErrors[key] = issue.message;
    }
    setErrors(nextErrors);
    return false;
  };

  const next = () => {
    if (!validate()) return false;
    setStep((current) => Math.min(current + 1, WIZARD_STEPS.length));
    return true;
  };

  const back = () => setStep((current) => Math.max(current - 1, 1));

  const submit = async () => {
    if (!validate(5)) return null;
    setSubmitting(true);
    try {
      const report = await reportsService.create({
        title: draft.title,
        description: draft.description,
        category: draft.category ?? "otro",
        barrio: draft.barrio,
        address: draft.address,
        coords: draft.coords,
        photos: draft.photos,
        consent: draft.consent,
      });
      setCreated(report);
      setStep(6);
      return report;
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "No se pudo enviar el reporte.",
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDraft(emptyDraft);
    setErrors({});
    setCreated(null);
    setStep(1);
  };

  return {
    step,
    steps: WIZARD_STEPS,
    draft,
    errors,
    submitting,
    created,
    update,
    next,
    back,
    submit,
    reset,
    goTo: setStep,
  };
}
