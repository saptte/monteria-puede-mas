import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

/** Galería con lightbox accesible para las evidencias de un reporte o proyecto. */
export const ImageGallery = ({ images, title, className }: ImageGalleryProps) => {
  const [active, setActive] = useState<string | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", className)}>
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(image)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-muted"
            aria-label={`Ampliar imagen ${index + 1} de ${images.length}`}
          >
            <img
              src={image}
              alt={`${title} — evidencia ${index + 1}`}
              crossOrigin="anonymous"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {active ? (
            <div className="relative overflow-hidden rounded-3xl bg-primary-deep/95 p-2">
              <img
                src={active}
                alt={title}
                crossOrigin="anonymous"
                className="max-h-[75vh] w-full rounded-2xl object-contain"
              />
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Cerrar imagen"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-primary-deep transition-colors hover:bg-background"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
