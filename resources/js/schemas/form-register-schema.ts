import { z } from "zod";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Nome obrigatório" }),
    email: z
      .string()
      .email({ message: "E-mail inválido" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    password_confirmation: z
      .string()
      .min(6, { message: "Confirmação de senha obrigatória" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

export default registerFormSchema;
