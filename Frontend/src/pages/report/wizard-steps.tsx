import { useRef, useState } from "react";
import {
  Camera,
  Check,
  ImagePlus,
  LocateFixed,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryIcon } from "@/components/common/category-badge";
import { MapCanvas } from "@/components/map/map-canvas";
import { CATEGORIES, CATEGORY_MAP } from "@/data/categories";
import { BARRIO_NAMES, nearestBarrio } from "@/data/barrios";
import { isPointInMonteria, locateUser } from "@/services/map-provider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { WizardDraft } from "@/hooks/use-report-wizard";
import type { GeoPoint, ReportCategoryId } from "@/types";

interface StepProps {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
  errors: Record<string, string>;
}

const ErrorText = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-[12px] font-semibold text-signal">{message}</p> : null;

/** Paso 1 — ¿Qué está pasando? */
export const StepCategory = ({ draft, update, errors }: StepProps) => (
  <div className="space-y-5">
    <p className="text-[14px] leading-relaxed text-muted-foreground">
      Elige el tema de tu reporte. Esto ayuda a que el caso llegue al equipo responsable y aparezca
      con su color en el mapa de Montería.
    </p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const isSelected = draft.category === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => update({ category: category.id as ReportCategoryId })}
            aria-pressed={isSelected}
            className={cn(
              "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ease-spring",
              isSelected
                ? "border-primary bg-tint shadow-soft"
                : "border-border/70 bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft",
            )}
          >
            <CategoryIcon category={category.id} />
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold text-primary-deep">
                {category.label}
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
                {category.description}
              </span>
            </span>
            {isSelected ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
    <ErrorText message={errors.category} />
  </div>
);

/** Paso 2 — Cuéntanos qué ocurre */
export const StepDescription = ({ draft, update, errors }: StepProps) => (
  <div className="space-y-5">
    <div>
      <Label htmlFor="report-title" className="text-[13px] font-bold text-primary-deep">
        Título del reporte
      </Label>
      <Input
        id="report-title"
        value={draft.title}
        onChange={(event) => update({ title: event.target.value })}
        placeholder="Ejemplo: Hueco en la vía principal frente al parque"
        maxLength={90}
        className="mt-1.5"
        aria-invalid={Boolean(errors.title)}
      />
      <div className="mt-1 flex items-center justify-between">
        <ErrorText message={errors.title} />
        <p className="text-[11.5px] text-muted-foreground">{draft.title.length}/90</p>
      </div>
    </div>

    <div>
      <Label htmlFor="report-description" className="text-[13px] font-bold text-primary-deep">
        Cuéntanos qué ocurre
      </Label>
      <Textarea
        id="report-description"
        value={draft.description}
        onChange={(event) => update({ description: event.target.value })}
        placeholder="Describe la situación: desde cuándo pasa, a quién afecta y qué has notado en el lugar."
        maxLength={600}
        className="mt-1.5"
        aria-invalid={Boolean(errors.description)}
      />
      <div className="mt-1 flex items-center justify-between">
        <ErrorText message={errors.description} />
        <p className="text-[11.5px] text-muted-foreground">{draft.description.length}/600</p>
      </div>
    </div>
  </div>
);

/** Paso 3 — ¿Dónde está pasando? */
export const StepLocation = ({ draft, update, errors }: StepProps) => {
  const { toast } = useToast();

  const placePoint = (point: GeoPoint) => {
    update({ coords: point, barrio: nearestBarrio(point).name });
  };

  const useMyLocation = () => {
    void locateUser()
      .then((point) => {
        if (!isPointInMonteria(point)) {
          toast({
            title: "Tu ubicación está fuera de Montería",
            description: "El reporte queda en la ciudad. Toca el mapa para marcar el punto.",
          });
          return;
        }
        placePoint(point);
        toast({
          title: "Ubicación tomada",
          description: `Quedó cerca de ${nearestBarrio(point).name}. Arrastra el pin si hace falta.`,
        });
      })
      .catch((error: { code?: number }) => {
        const blocked = error.code === 1 || error.code === 0;
        toast({
          title: blocked ? "El navegador bloqueó la ubicación" : "No pudimos obtener tu ubicación",
          description: blocked
            ? "Permite la ubicación en el candado de la barra de direcciones, o toca el mapa para marcar el punto."
            : "Toca el mapa para marcar el punto, o elige el barrio en la lista.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-5">
      <div className="relative h-[300px] overflow-hidden rounded-2xl border border-border/70 sm:h-[360px]">
        <MapCanvas
          reports={[]}
          mode="single"
          pickerPoint={draft.coords}
          onMapClick={placePoint}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 z-[700] rounded-2xl bg-background/95 px-3 py-2 shadow-soft backdrop-blur">
          <p className="text-[11.5px] font-bold text-primary-deep">
            Toca el mapa para ubicar el punto exacto
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outlineBrand" onClick={useMyLocation}>
          <LocateFixed className="h-4 w-4" aria-hidden />
          Usar mi ubicación
        </Button>
        <p className="text-[12px] text-muted-foreground">
          {draft.coords.lat.toFixed(5)}, {draft.coords.lng.toFixed(5)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="report-barrio" className="text-[13px] font-bold text-primary-deep">
            Barrio o zona
          </Label>
          <select
            id="report-barrio"
            value={draft.barrio}
            onChange={(event) => update({ barrio: event.target.value })}
            className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-background px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary/30 focus-visible:border-primary focus-visible:outline-none"
          >
            <option value="">Selecciona el barrio</option>
            {BARRIO_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ErrorText message={errors.barrio} />
        </div>
        <div>
          <Label htmlFor="report-address" className="text-[13px] font-bold text-primary-deep">
            Dirección o referencia
          </Label>
          <Input
            id="report-address"
            value={draft.address}
            onChange={(event) => update({ address: event.target.value })}
            placeholder="Ejemplo: Calle 34 # 12-40, frente a la tienda"
            className="mt-1.5"
          />
          <ErrorText message={errors.address} />
        </div>
      </div>
    </div>
  );
};

/** Paso 4 — Agrega evidencia */
export const StepEvidence = ({ draft, update, errors }: StepProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    update({ photos: [...draft.photos, ...urls].slice(0, 6) });
    toast({
      title: "Evidencia agregada",
      description: `${urls.length} archivo(s) listos para enviar con tu reporte.`,
    });
  };

  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url);
    update({ photos: draft.photos.filter((item) => item !== url) });
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-primary bg-tint" : "border-primary/25 bg-tint/40",
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary shadow-soft">
          <ImagePlus className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="font-display text-[16px] text-primary-deep">
            Arrastra tus fotos o videos aquí
          </p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Hasta 6 archivos · imágenes o videos del lugar
          </p>
        </div>
        <Button type="button" variant="sun" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4" aria-hidden />
          Seleccionar archivos
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
          aria-label="Adjuntar evidencia fotográfica"
        />
      </div>

      {draft.photos.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {draft.photos.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-muted"
            >
              {url.startsWith("blob:") ? (
                <img
                  src={url}
                  alt={`Evidencia ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-primary">
                  <Video className="h-6 w-6" aria-hidden />
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(url)}
                aria-label={`Eliminar evidencia ${index + 1}`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-signal transition-colors hover:bg-background"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <p className="inline-flex items-center gap-2 text-[12px] text-muted-foreground">
        <Camera className="h-4 w-4 text-primary" aria-hidden />
        Las fotos ayudan a que el caso se valide más rápido.
      </p>
      <ErrorText message={errors.photos} />
    </div>
  );
};

/** Paso 5 — Datos y autorización */
export const StepConsent = ({ draft, update, errors }: StepProps) => {
  const category = draft.category ? CATEGORY_MAP[draft.category] : undefined;

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-3xl border border-border/70 bg-tint/40 p-5">
        <p className="font-display text-[16px] text-primary-deep">Resumen de tu reporte</p>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Tema
            </dt>
            <dd className="text-[13.5px] font-semibold text-foreground/85">
              {category?.label ?? "Sin seleccionar"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Ubicación
            </dt>
            <dd className="text-[13.5px] font-semibold text-foreground/85">
              {draft.barrio || "Sin barrio"} · {draft.address || "Sin dirección"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Título
            </dt>
            <dd className="text-[13.5px] font-semibold text-foreground/85">
              {draft.title || "Sin título"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Evidencia
            </dt>
            <dd className="text-[13.5px] font-semibold text-foreground/85">
              {draft.photos.length} archivo(s)
            </dd>
          </div>
        </dl>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-border/70 p-5">
        <Checkbox
          checked={draft.consent}
          onCheckedChange={(checked) => update({ consent: checked === true })}
          aria-label="Autorizo el tratamiento de mis datos personales"
          className="mt-0.5"
        />
        <span className="text-[13px] leading-relaxed text-foreground/80">
          Autorizo el tratamiento de mis datos personales y el uso de la información y evidencia de
          este reporte para su gestión, seguimiento y publicación en el mapa de Montería. Conozco que
          puedo solicitar la actualización o eliminación de mis datos.
        </span>
      </label>
      <ErrorText message={errors.consent} />
      <ErrorText message={errors.form} />

      <p className="rounded-2xl bg-primary/5 px-4 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
        Para el ciudadano todo ocurre dentro de Montería Puede Más: la clasificación, la
        georreferenciación y el seguimiento del caso los gestiona la plataforma.
      </p>
    </div>
  );
};
