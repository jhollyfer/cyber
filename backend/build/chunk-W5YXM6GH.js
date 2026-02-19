// application/resources/questions/find-by-module/find-by-module.doc.ts
var FindByModuleQuestionsDocumentationSchema = {
  tags: [
    "Questions"
  ],
  summary: "List questions by module",
  description: "Returns all questions for a given module. Requires ADMINISTRATOR role.",
  params: {
    type: "object",
    required: [
      "moduleId"
    ],
    properties: {
      moduleId: {
        type: "string",
        format: "uuid",
        description: "Module ID"
      }
    }
  },
  response: {
    200: {
      description: "List of questions for the module",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          question: {
            type: "string"
          },
          options: {
            type: "array",
            items: {
              type: "string"
            }
          },
          correct: {
            type: "number"
          },
          explanation: {
            type: "string"
          },
          category: {
            type: "string"
          },
          context: {
            type: "string",
            nullable: true
          },
          order: {
            type: "number"
          },
          active: {
            type: "boolean"
          },
          module_id: {
            type: "string",
            format: "uuid"
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
    },
    403: {
      description: "Insufficient permissions",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "Insufficient permissions"
          ]
        },
        code: {
          type: "number",
          examples: [
            403
          ]
        },
        cause: {
          type: "string",
          examples: [
            "INSUFFICIENT_PERMISSIONS"
          ]
        }
      }
    }
  }
};

export {
  FindByModuleQuestionsDocumentationSchema
};
