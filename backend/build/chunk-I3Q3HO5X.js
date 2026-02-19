// application/resources/modules/find-one/find-one.doc.ts
var FindOneModuleDocumentationSchema = {
  tags: [
    "Modules"
  ],
  summary: "Find module by ID",
  description: "Returns a single module by its ID. Requires authentication.",
  params: {
    type: "object",
    required: [
      "id"
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "Module ID"
      }
    }
  },
  response: {
    200: {
      description: "Module found",
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
    },
    404: {
      description: "Module not found",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "Module not found"
          ]
        },
        code: {
          type: "number",
          examples: [
            404
          ]
        },
        cause: {
          type: "string",
          examples: [
            "MODULE_NOT_FOUND"
          ]
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
  FindOneModuleDocumentationSchema
};
