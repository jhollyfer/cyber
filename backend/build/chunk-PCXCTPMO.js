// application/resources/modules/find-all/find-all.doc.ts
var FindAllModulesDocumentationSchema = {
  tags: [
    "Modules"
  ],
  summary: "List all modules",
  description: "Returns a list of all active modules. Requires authentication.",
  response: {
    200: {
      description: "List of modules",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          title: {
            type: "string"
          },
          description: {
            type: "string"
          },
          icon: {
            type: "string"
          },
          label: {
            type: "string"
          },
          order: {
            type: "number"
          },
          time_per_question: {
            type: "number"
          },
          gradient: {
            type: "string"
          },
          category_color: {
            type: "string"
          },
          active: {
            type: "boolean"
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          updated_at: {
            type: "string",
            format: "date-time"
          }
        }
      }
    },
    401: {
      description: "Authentication required",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "Authentication required"
          ]
        },
        code: {
          type: "number",
          examples: [
            401
          ]
        },
        cause: {
          type: "string",
          examples: [
            "AUTHENTICATION_REQUIRED"
          ]
        }
      }
    }
  }
};

export {
  FindAllModulesDocumentationSchema
};
