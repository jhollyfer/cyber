// application/resources/game/finish-session/finish-session.doc.ts
var FinishSessionDocumentationSchema = {
  tags: [
    "Game"
  ],
  summary: "Finish a game session",
  description: "Finalizes a game session, calculates the grade, and updates the best session flag",
  params: {
    type: "object",
    required: [
      "id"
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "The session ID"
      }
    }
  },
  response: {
    200: {
      description: "Session finished successfully",
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
          type: "number"
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
          format: "date-time"
        }
      }
    },
    404: {
      description: "Session not found",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "Session not found"
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
            "SESSION_NOT_FOUND"
          ]
        }
      }
    },
    400: {
      description: "Session already finished",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "Session is already finished"
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
            "SESSION_ALREADY_FINISHED"
          ]
        }
      }
    },
    403: {
      description: "Session ownership error",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "You do not own this session"
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
            "SESSION_OWNERSHIP_ERROR"
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
            "FINISH_SESSION_ERROR"
          ]
        }
      }
    }
  }
};

export {
  FinishSessionDocumentationSchema
};
