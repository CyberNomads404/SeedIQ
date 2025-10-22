import { z } from "zod";

const categoryFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
        .max(100, { message: "O nome deve ter no máximo 100 caracteres" })
        .trim(),
    tag: z
        .string()
        .min(2, { message: "A tag deve ter pelo menos 2 caracteres" })
        .max(50, { message: "A tag deve ter no máximo 50 caracteres" })
        .trim(),
    icon: z
        .union([z.string(), z.instanceof(File)])
        .nullable()
        .optional(),
});

export { categoryFormSchema };
