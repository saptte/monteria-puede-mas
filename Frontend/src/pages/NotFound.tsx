import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
    <Wordmark size="md" className="items-center" />
    <p className="eyebrow">Error 404</p>
    <h1 className="max-w-2xl text-[30px] leading-tight text-primary-deep sm:text-[40px]">
      Esta página no hace parte del mapa.
    </h1>
    <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
      Puede que el enlace haya cambiado. Vuelve al inicio o explora el mapa de reportes ciudadanos de
      Montería.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild variant="sun" size="lg">
        <Link to="/">
          Volver al inicio
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
      <Button asChild variant="outlineBrand" size="lg">
        <Link to="/mapa">
          <MapPin className="h-4 w-4" aria-hidden />
          Ir al mapa de Montería
        </Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
