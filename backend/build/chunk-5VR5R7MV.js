// application/core/schemas.ts
import z from "zod";
var IdParamSchema = z.object({
  id: z.string().uuid("Invalid ID format")
});
var ModuleIdParamSchema = z.object({
  moduleId: z.string().uuid("Invalid module ID format")
});

export {
  IdParamSchema,
  ModuleIdParamSchema
};
