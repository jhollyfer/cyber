// application/resources/questions/update/update.schema.ts
import z from "zod";
var UpdateQuestionParamsSchema = z.object({
  id: z.string().uuid("Invalid question ID")
});
var UpdateQuestionBodySchema = z.object({
  question: z.string().trim().min(1, "Question is required").optional(),
  options: z.array(z.string().trim().min(1, "Option cannot be empty")).length(4, "Exactly 4 options are required").optional(),
  correct: z.number().int().min(0, "Correct option must be between 0 and 3").max(3, "Correct option must be between 0 and 3").optional(),
  explanation: z.string().trim().min(1, "Explanation is required").optional(),
  category: z.string().trim().min(1, "Category is required").optional(),
  context: z.string().trim().nullish(),
  order: z.number().int().optional()
});

export {
  UpdateQuestionParamsSchema,
  UpdateQuestionBodySchema
};
