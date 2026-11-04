import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";

const COLUMNS = [
  {
    title: "Participa",
    links: [
      { label: "El Muro", path: "/muro" },
      { label: "Montería Habla", path: "/monteria-habla" },
      { label: "Montería Hace", path: "/monteria-hace" },
      { label: "Montería Resuelve", path: "/monteria-resuelve" },
      { label: "El Mapa de Montería", path: "/mapa" },
      { label: "Reportar un problema", path: "/reportar" },
    ],
  },
  {
    title: "Información",
    links: [
      { label: "Sobre la plataforma", path: "/sobre-la-plataforma" },
      { label: "Cómo funciona", path: "/sobre-la-plataforma#como-funciona" },
      { label: "Preguntas frecuentes", path: "/sobre-la-plataforma#preguntas" },
      { label: "Tratamiento de datos", path: "/sobre-la-plataforma#privacidad" },
      { label: "Mi Montería", path: "/mi-monteria" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Youtube },
];

/** Footer institucional moderno. */
export const Footer = () => (
  <footer className="mt-16 border-t border-border/70 bg-tint/60 pb-24 pt-14 lg:pb-14">
    <div className="container-page">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Wordmark size="md" />
          <p className="max-w-xs text-[14px] leading-relaxed text-muted-foreground">
            Una plataforma para escuchar, participar y transformar nuestra ciudad.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:border-primary/40 hover:bg-tint"
              >
                <social.icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="space-y-3">
            <p className="eyebrow">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[14px] text-foreground/75 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="space-y-3">
          <p className="eyebrow">Contacto</p>
          <ul className="space-y-3 text-[14px] text-foreground/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
              Montería, Córdoba — Colombia
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
              hola@monteriapuedemas.co
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
              Línea de atención ciudadana
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Montería Puede Más. Todos los derechos reservados.</p>
        <p>Escuchar · Entender · Ubicar · Actuar · Resolver · Mostrar resultados</p>
      </div>
    </div>
  </footer>
);
