import { z } from "zod";

const resetPasswordFormSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
});

export default resetPasswordFormSchema;
