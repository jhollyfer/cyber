// application/resources/authentication/sign-in/sign-in.doc.ts
var SignInDocumentationSchema = {
  tags: [
    "Authentication"
  ],
  summary: "User authentication sign in",
  description: "Authenticates a user with phone and password, returning JWT tokens as HTTP-only cookies",
  body: {
    type: "object",
    required: [
      "phone",
      "password"
    ],
    properties: {
      phone: {
        type: "string",
        description: "User phone number",
        examples: [
          "11987654321"
        ]
      },
      password: {
        type: "string",
        description: "User password"
      }
    }
  },
  response: {
    200: {
      description: "Successful authentication - Sets httpOnly cookies for accessToken and refreshToken",
      type: "object",
      properties: {
        message: {
          type: "string",
          enum: [
            "Authentication successful"
          ]
        }
      },
      headers: {
        "Set-Cookie": {
          type: "string",
          description: "Authentication cookies (accessToken, refreshToken)"
        }
      }
    },
    400: {
      description: "Bad request - Invalid request format or Zod validation failed",
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Error description"
        },
        code: {
          type: "number",
          enum: [
            400
          ]
        },
        cause: {
          type: "string",
          enum: [
            "INVALID_PARAMETERS"
          ]
        },
        errors: {
          type: "object",
          properties: {
            phone: {
              type: "string",
              description: "Phone error message"
            },
            password: {
              type: "string",
              description: "Password error message"
            }
          }
        }
      }
    },
    401: {
      description: "Unauthorized - User not found, inactive, or wrong password",
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Specific error message"
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
      },
      examples: [
        {
          message: "Credenciais invalidas",
          code: 401,
          cause: "AUTHENTICATION_REQUIRED"
        }
      ]
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
          enum: [
            500
          ]
        },
        cause: {
          type: "string",
          examples: [
            "SIGN_IN_ERROR"
          ]
        }
      }
    }
  }
};

export {
  SignInDocumentationSchema
};
