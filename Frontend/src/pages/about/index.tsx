import { Link } from "react-router-dom";
import {
  ArrowRight,
  Ear,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { KpiStrip } from "@/components/common/kpi-strip";
import { InstitutionalBanner } from "@/components/common/institutional-banner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MEDIA } from "@/data/media";
import { HOME_STATS } from "@/data/stats.mock";
import { useAuth } from "@/context/auth-context";

const STAGES = [
  {
    title: "Escuchar",
    description: "La ciudadanía conversa, opina y cuenta lo que vive en su barrio.",
    icon: Ear,
  },
  {
    title: "Entender",
    description: "Los temas se organizan por categoría y se identifican patrones en la ciudad.",
    icon: Lightbulb,
  },
  {
    title: "Ubicar",
    description: "Cada reporte queda georreferenciado en el mapa de Montería.",
    icon: MapPin,
  },
  {
    title: "Actuar",
    description: "Se asignan responsables y se acuerdan acciones con aliados y comunidad.",
    icon: Wrench,
  },
  {
    title: "Resolver",
    description: "Los casos avanzan hasta convertirse en obras, pilotos o soluciones concretas.",
    icon: Target,
  },
  {
    title: "Mostrar resultados",
    description: "Cada avance se publica y se verifica con la comunidad.",
    icon: TrendingUp,
  },
];

const FAQ = [
  {
    question: "¿Qué es Montería Puede Más?",
    answer:
      "Es la plataforma digital de participación ciudadana de Montería: un solo lugar para conversar, proponer, reportar problemas de la ciudad, ubicarlos en el mapa y hacer seguimiento a las soluciones.",
  },
  {
    question: "¿Necesito crear una cuenta para reportar?",
    answer:
      "Puedes recorrer el mapa y las conversaciones sin cuenta. Para reportar, proponer y hacer seguimiento a tus casos creamos tu perfil ciudadano, así puedes recibir las actualizaciones de cada reporte.",
  },
  {
    question: "¿Cómo se atiende un reporte?",
    answer:
      "Cada reporte recibe un número de caso y recorre seis etapas: recibido, validado, en revisión, asignado, en ejecución y resuelto. En cada etapa verás la fecha, el responsable y la actualización.",
  },
  {
    question: "¿Puedo reportar sin fotografías?",
    answer:
      "Sí, aunque una fotografía o un video ayudan a validar el caso más rápido y permiten que otros vecinos reconozcan la situación.",
  },
  {
    question: "¿Qué pasa con mis datos personales?",
    answer:
      "Tus datos se usan únicamente para gestionar y dar seguimiento a tu reporte o propuesta. Puedes solicitar su actualización o eliminación en cualquier momento y nunca publicamos tu información de contacto en el mapa.",
  },
  {
    question: "¿Cómo puedo participar sin reportar problemas?",
    answer:
      "Puedes entrar a las conversaciones de Montería Habla, apoyar propuestas de otros vecinos, sumarte a retos y voluntariados en Montería Hace o seguir los proyectos en Montería Resuelve.",
  },
];

/** Sobre la plataforma: cómo funciona, preguntas frecuentes y datos. */
const AboutPage = () => {
  const { isAuthenticated, openAuth } = useAuth();

  return (
    <>
      <PageHero
        eyebrow="Sobre la plataforma"
        title={
          <>
            Una ciudad
            <br />
            más clara, con la gente adentro.
          </>
        }
        accent="Escuchar, entender, ubicar, actuar."
        description="Montería Puede Más conecta la voz de la ciudadanía con la gestión de los problemas de la ciudad. Todo ocurre en un mismo lugar: reportas, participas y ves los resultados."
        image={MEDIA.aerea}
        imageAlt="Vista aérea de Montería"
      >
        <Button asChild variant="sun" size="xl">
          <Link to="/reportar">
            Reportar un problema
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outlineBrand" size="xl">
          <Link to="/mapa">
            Ver el mapa
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </PageHero>

      <section className="pb-6" aria-label="Indicadores de la plataforma">
        <div className="container-page">
          <KpiStrip stats={HOME_STATS} />
        </div>
      </section>

      <section id="como-funciona" className="section-y bg-background" aria-labelledby="como-title">
        <div className="container-page space-y-10">
          <Reveal>
            <SectionHeader
              eyebrow="Cómo funciona"
              title={<span id="como-title">Seis pasos, un mismo camino</span>}
              description="Así viaja cada aporte ciudadano dentro de Montería Puede Más, desde la conversación hasta el resultado verificable."
            />
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STAGES.map((stage, index) => (
              <Reveal key={stage.title} delay={index * 0.05} className="h-full">
                <div className="flex h-full items-start gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint text-primary">
                    <stage.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">
                      Etapa {index + 1}
                    </p>
                    <h3 className="font-display text-[16px] leading-tight text-primary-deep">
                      {stage.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="preguntas" className="section-y bg-gradient-tint" aria-labelledby="faq-title">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:items-start">
          <SectionHeader
            eyebrow="Preguntas frecuentes"
            title={<span id="faq-title">Todo lo que necesitas saber</span>}
            description="Estas son las dudas más comunes sobre cómo usar la plataforma."
          />

          <Reveal>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((item) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="rounded-2xl border border-border/70 bg-card px-5 shadow-soft"
                >
                  <AccordionTrigger className="py-4 text-left text-[14.5px] font-bold text-primary-deep hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-[13.5px] leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section id="privacidad" className="section-y bg-background" aria-labelledby="privacidad-title">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="card-soft space-y-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tint text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="privacidad-title" className="font-display text-[18px] text-primary-deep">
              Tratamiento de datos personales
            </h2>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              Usamos tus datos únicamente para gestionar los reportes, propuestas y participaciones
              que registres, y para informarte sobre el avance de los casos. Nunca publicamos tu
              correo, tu celular ni tu nombre en el mapa de la ciudad.
            </p>
            <ul className="space-y-2 text-[13px] text-foreground/80">
              {[
                "Autorizas el tratamiento al enviar un reporte o crear tu cuenta.",
                "Puedes solicitar actualización o eliminación de tus datos.",
                "Las evidencias que subes se usan para validar el caso reportado.",
                "Los datos agregados alimentan los indicadores públicos de la ciudad.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-soft space-y-4 p-6">
            <h2 className="font-display text-[18px] text-primary-deep">Contacto ciudadano</h2>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              ¿Tienes una duda, una alianza o una propuesta para la plataforma? Escríbenos y el equipo
              de Montería Puede Más te responde.
            </p>
            <div className="space-y-2 rounded-2xl bg-tint/60 p-4 text-[13px] text-foreground/80">
              <p className="font-bold text-primary-deep">Correo</p>
              <p>hola@monteriapuedemas.co</p>
              <p className="pt-2 font-bold text-primary-deep">Ciudad</p>
              <p>Montería, Córdoba — Colombia</p>
            </div>
            <Button
              variant="sun"
              size="lg"
              className="w-full"
              onClick={() => (isAuthenticated ? undefined : openAuth("register"))}
            >
              Súmate a la plataforma
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      <InstitutionalBanner
        onPrimary={() => (isAuthenticated ? undefined : openAuth("register"))}
      />
    </>
  );
};

export default AboutPage;
