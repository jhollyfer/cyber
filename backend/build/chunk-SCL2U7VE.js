// application/resources/game/submit-answer/submit-answer.schema.ts
import z from "zod";
var SubmitAnswerBodySchema = z.object({
  question_id: z.string().uuid("O question_id deve ser um UUID valido"),
  selected_option: z.number().min(0, "A opcao selecionada deve ser no minimo 0"),
  time_spent: z.number().min(0, "O tempo gasto deve ser no minimo 0").optional().default(0)
});

export {
  SubmitAnswerBodySchema
};
