import { Skeleton } from "@/components/ui/skeleton";

/** Estado de carga de una página mientras llega su fragmento de código. */
export const PageSkeleton = () => (
  <div className="container-page space-y-6 py-12" aria-busy="true" aria-live="polite">
    <span className="sr-only">Cargando contenido</span>
    <Skeleton className="h-6 w-40" />
    <Skeleton className="h-12 w-full max-w-2xl" />
    <Skeleton className="h-4 w-full max-w-xl" />
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-[220px] w-full" />
      ))}
    </div>
  </div>
);
