// application/resources/questions/create/create.doc.ts
var CreateQuestionDocumentationSchema = {
  tags: [
    "Questions"
  ],
  summary: "Create a new question",
  description: "Creates a new question for a module. Requires ADMINISTRATOR role.",
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
  body: {
    type: "object",
    required: [
      "question",
      "options",
      "correct",
      "explanation",
      "category"
    ],
    properties: {
      question: {
        type: "string",
        description: "Question text",
        examples: [
          "What is a firewall?"
        ]
      },
      options: {
        type: "array",
        description: "Exactly 4 answer options",
        items: {
          type: "string"
        },
        minItems: 4,
        maxItems: 4,
        examples: [
          [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ]
        ]
      },
      correct: {
        type: "number",
        description: "Index of the correct option (0-3)",
        minimum: 0,
        maximum: 3,
        examples: [
          0
        ]
      },
      explanation: {
        type: "string",
        description: "Explanation for the correct answer",
        examples: [
          "A firewall is a network security system that monitors traffic."
        ]
      },
      category: {
        type: "string",
        description: "Question category",
        examples: [
          "Network Security"
        ]
      },
      context: {
        type: "string",
        nullable: true,
        description: "Additional context for the question (optional)",
        examples: [
          "Consider a corporate network environment."
        ]
      },
      order: {
        type: "number",
        description: "Display order (default: 0)",
        examples: [
          1
        ]
      }
    }
  },
  response: {
    201: {
      description: "Question created successfully",
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
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        message: {
          type: "string"
        },
        code: {
          type: "number",
          examples: [
            500
          ]
        },
        cause: {
          type: "string",
          examples: [
            "CREATE_QUESTION_ERROR"
          ]
        }
      }
    }
  }
};

export {
  CreateQuestionDocumentationSchema
};
