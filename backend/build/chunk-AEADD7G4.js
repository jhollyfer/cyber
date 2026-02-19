// application/resources/game/start-session/start-session.schema.ts
import z from "zod";
var StartSessionBodySchema = z.object({
  module_id: z.string().uuid("O module_id deve ser um UUID valido")
});

export {
  StartSessionBodySchema
};
