// application/resources/authentication/me/me.doc.ts
var MeDocumentationSchema = {
  tags: [
    "Authentication"
  ],
  summary: "Get current user profile",
  description: "Returns the authenticated user profile data. Requires valid access token.",
  security: [
    {
      cookieAuth: []
    }
  ],
  response: {
    200: {
      description: "Current user profile data",
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid"
        },
        name: {
          type: "string"
        },
        phone: {
          type: "string"
        },
        role: {
          type: "string",
          enum: [
            "ADMINISTRATOR",
            "STUDENT"
          ]
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
    401: {
      description: "Unauthorized - Invalid or missing access token",
      type: "object",
      properties: {
        message: {
          type: "string",
          enum: [
            "Authentication required"
          ]
        },
        code: {
          type: "number",
          enum: [
            401
          ]
        },
        cause: {
          type: "string",
          enum: [
            "AUTHENTICATION_REQUIRED"
          ]
        }
      }
    },
    404: {
      description: "User not found",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "User not found"
          ]
        },
        code: {
          type: "number",
          enum: [
            404
          ]
        },
        cause: {
          type: "string",
          examples: [
            "USER_NOT_FOUND"
          ]
        }
      }
    }
  }
};

export {
  MeDocumentationSchema
};
