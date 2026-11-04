import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Lock, Mail, Phone, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wordmark } from "@/components/brand/wordmark";
import { useAuth } from "@/context/auth-context";
import { loginSchema, registerSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
    />
    <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.5H1.4a12 12 0 0 0 0 11l4-3.1Z" />
    <path
      fill="#EA4335"
      d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
    <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
    <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
    <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
  </svg>
);

/** Modal de acceso ciudadano: iniciar sesión o crear cuenta. */
export const AuthModal = () => {
  const { modalOpen, closeAuth, tab, setTab, login, register, loginWithProvider } = useAuth();
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setFormError(null);
    setErrors({});
  }, [tab, modalOpen]);

  const runProvider = async (provider: "google" | "microsoft") => {
    setProviderLoading(provider);
    setFormError(null);
    try {
      await loginWithProvider(provider);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No pudimos completar el acceso.");
    } finally {
      setProviderLoading(null);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(parsed.data);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No pudimos iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      password: String(data.get("password") ?? ""),
      confirm: String(data.get("confirm") ?? ""),
      consent,
    });
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        password: parsed.data.password,
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No pudimos crear tu cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key: string) =>
    errors[key] ? <p className="mt-1 text-[12px] font-semibold text-signal">{errors[key]}</p> : null;

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="max-h-[92vh] max-w-[460px] overflow-y-auto rounded-3xl border-border/70 p-6 sm:p-7">
        <DialogTitle className="sr-only">Únete a Montería Puede Más</DialogTitle>
        <DialogDescription className="sr-only">
          Crea tu cuenta o inicia sesión para reportar, participar y hacer seguimiento.
        </DialogDescription>

        <Wordmark size="md" />
        <div className="mt-4 space-y-1">
          <p className="eyebrow">Plataforma ciudadana</p>
          <h2 className="text-[26px] leading-tight text-primary-deep">Únete a Montería Puede Más</h2>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Crea tu cuenta o inicia sesión para reportar, participar y hacer seguimiento.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")} className="mt-5">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-tint p-1">
            <TabsTrigger
              value="login"
              className="rounded-full py-2 text-[13px] font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-soft"
            >
              Iniciar sesión
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-full py-2 text-[13px] font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-soft"
            >
              Crear cuenta
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "login" ? (
          <form className="mt-5 space-y-4" onSubmit={handleLogin} noValidate>
            <div>
              <Label htmlFor="login-email" className="text-[13px] font-bold text-primary-deep">
                Correo electrónico
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-11"
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
              {fieldError("email")}
            </div>

            <div>
              <Label htmlFor="login-password" className="text-[13px] font-bold text-primary-deep">
                Contraseña
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-11"
                  aria-invalid={Boolean(errors.password)}
                />
              </div>
              {fieldError("password")}
            </div>

            {formError ? (
              <p role="alert" className="rounded-2xl bg-signal/10 px-4 py-3 text-[13px] font-semibold text-signal">
                {formError}
              </p>
            ) : null}

            <Button type="submit" variant="sun" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Iniciar sesión
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[12px] text-muted-foreground">o continúa con</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outlineBrand"
                onClick={() => runProvider("google")}
                disabled={providerLoading === "google"}
              >
                <GoogleIcon />
                Google
              </Button>
              <Button
                type="button"
                variant="outlineBrand"
                onClick={() => runProvider("microsoft")}
                disabled={providerLoading === "microsoft"}
              >
                <MicrosoftIcon />
                Microsoft
              </Button>
            </div>
          </form>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={handleRegister} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="register-first" className="text-[13px] font-bold text-primary-deep">
                  Nombre
                </Label>
                <div className="relative mt-1.5">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input id="register-first" name="firstName" placeholder="José" className="pl-11" />
                </div>
                {fieldError("firstName")}
              </div>
              <div>
                <Label htmlFor="register-last" className="text-[13px] font-bold text-primary-deep">
                  Apellidos
                </Label>
                <Input id="register-last" name="lastName" placeholder="Martínez" className="mt-1.5" />
                {fieldError("lastName")}
              </div>
            </div>

            <div>
              <Label htmlFor="register-email" className="text-[13px] font-bold text-primary-deep">
                Correo electrónico
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-11"
                />
              </div>
              {fieldError("email")}
            </div>

            <div>
              <Label htmlFor="register-phone" className="text-[13px] font-bold text-primary-deep">
                Celular
              </Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input id="register-phone" name="phone" inputMode="tel" placeholder="+57 300 000 0000" className="pl-11" />
              </div>
              {fieldError("phone")}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="register-password" className="text-[13px] font-bold text-primary-deep">
                  Contraseña
                </Label>
                <Input id="register-password" name="password" type="password" placeholder="••••••••" className="mt-1.5" />
                {fieldError("password")}
              </div>
              <div>
                <Label htmlFor="register-confirm" className="text-[13px] font-bold text-primary-deep">
                  Confirmar contraseña
                </Label>
                <Input id="register-confirm" name="confirm" type="password" placeholder="••••••••" className="mt-1.5" />
                {fieldError("confirm")}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-tint/60 p-3">
              <Checkbox
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                aria-label="Acepto la política de tratamiento de datos"
                className="mt-0.5"
              />
              <span className="text-[12.5px] leading-relaxed text-foreground/80">
                Acepto la política de tratamiento de datos personales y autorizo el uso de mi
                información para la gestión de reportes y participación ciudadana.
              </span>
            </label>
            {fieldError("consent")}

            {formError ? (
              <p role="alert" className="rounded-2xl bg-signal/10 px-4 py-3 text-[13px] font-semibold text-signal">
                {formError}
              </p>
            ) : null}

            <Button type="submit" variant="sun" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Crear mi cuenta
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </form>
        )}

        <p className={cn("mt-4 text-center text-[12px] text-muted-foreground")}>
          Para el ciudadano todo ocurre dentro de Montería Puede Más.
        </p>
      </DialogContent>
    </Dialog>
  );
};
