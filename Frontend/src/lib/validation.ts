import { z } from "zod";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailField = (requiredMessage: string) =>
  z.string().trim().min(1, requiredMessage).regex(EMAIL_PATTERN, "Revisa el correo electrónico.");

export const stepCategorySchema = z.object({
  category: z.string().min(1, "Selecciona el tema de tu reporte."),
});

export const stepDescriptionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(6, "Escribe un título de al menos 6 caracteres.")
    .max(90, "El título no puede superar 90 caracteres."),
  description: z
    .string()
    .trim()
    .min(20, "Cuéntanos un poco más: mínimo 20 caracteres.")
    .max(600, "La descripción no puede superar 600 caracteres."),
});

export const stepLocationSchema = z.object({
  barrio: z.string().trim().min(2, "Indica el barrio o la dirección."),
  address: z.string().trim().min(3, "Agrega una referencia del lugar."),
  lat: z.number(),
  lng: z.number(),
});

export const stepEvidenceSchema = z.object({
  photos: z.array(z.string()).min(1, "Adjunta al menos una fotografía o video."),
});

export const stepConsentSchema = z.object({
  consent: z.literal(true, { message: "Debes autorizar el tratamiento de datos." }),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Ingresa tu nombre."),
    lastName: z.string().trim().min(2, "Ingresa tus apellidos."),
    email: emailField("Ingresa tu correo electrónico."),
    phone: z.string().trim().min(7, "Ingresa un número de contacto."),
    password: z.string().min(6, "Mínimo 6 caracteres."),
    confirm: z.string(),
    consent: z.literal(true, { message: "Debes aceptar la política de datos." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden.",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  email: emailField("Ingresa tu correo electrónico."),
  password: z.string().min(6, "Mínimo 6 caracteres."),
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
