// application/resources/game/start-session/start-session.doc.ts
var StartSessionDocumentationSchema = {
  tags: [
    "Game"
  ],
  summary: "Start a new game session",
  description: "Creates a new game session for a module and returns shuffled questions",
  body: {
    type: "object",
    required: [
      "module_id"
    ],
    properties: {
      module_id: {
        type: "string",
        format: "uuid",
        description: "The module ID to start a session for"
      }
    }
  },
  response: {
    201: {
      description: "Session created successfully",
      type: "object",
      properties: {
        session: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            score: {
              type: "number"
            },
            correct_answers: {
              type: "number"
            },
            total_answered: {
              type: "number"
            },
            streak: {
              type: "number"
            },
            max_streak: {
              type: "number"
            },
            nota: {
              type: "number",
              nullable: true
            },
            finished: {
              type: "boolean"
            },
            is_best: {
              type: "boolean"
            },
            user_id: {
              type: "string",
              format: "uuid"
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
            },
            finished_at: {
              type: "string",
              format: "date-time",
              nullable: true
            }
          }
        },
        questions: {
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
    400: {
      description: "Module is not active",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "Module is not active"
          ]
        },
        code: {
          type: "number",
          examples: [
            400
          ]
        },
        cause: {
          type: "string",
          examples: [
            "MODULE_NOT_ACTIVE"
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
            "START_SESSION_ERROR"
          ]
        }
      }
    }
  }
};

export {
  StartSessionDocumentationSchema
};
