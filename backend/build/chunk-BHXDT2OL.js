// application/resources/authentication/sign-up/sign-up.schema.ts
import z from "zod";
var SignUpBodySchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter no minimo 2 caracteres"),
  phone: z.string().trim().transform((v) => v.replace(/\D/g, "")).pipe(z.string().length(11, "O telefone deve ter exatamente 11 digitos")),
  password: z.string().trim().min(6, "A senha deve ter no minimo 6 caracteres").regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"|,.<>?\/\\`~]).{6,}$/, "Senha deve ter no minimo 6 caracteres, com pelo menos 1 maiuscula, 1 minuscula, 1 numero e 1 caractere especial.")
});

export {
  SignUpBodySchema
};
