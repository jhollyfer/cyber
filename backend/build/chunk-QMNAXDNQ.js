// application/resources/authentication/sign-up/sign-up.doc.ts
var SignUpDocumentationSchema = {
  tags: [
    "Authentication"
  ],
  summary: "User registration",
  description: "Register a new student account with name, phone and password",
  body: {
    type: "object",
    required: [
      "name",
      "phone",
      "password"
    ],
    properties: {
      name: {
        type: "string",
        description: "User name (minimum 2 characters)",
        examples: [
          "Jo\xE3o Silva"
        ]
      },
      phone: {
        type: "string",
        description: "Phone number (minimum 10 characters)",
        examples: [
          "11987654321"
        ]
      },
      password: {
        type: "string",
        description: "Password (minimum 6 characters)",
        examples: [
          "senha123"
        ]
      }
    }
  },
  response: {
    201: {
      description: "Registration successful - Sets httpOnly cookies for accessToken and refreshToken",
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
      },
      headers: {
        "Set-Cookie": {
          type: "string",
          description: "Authentication cookies (accessToken, refreshToken)"
        }
      }
    },
    409: {
      description: "User already exists",
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "User already exists"
          ]
        },
        code: {
          type: "number",
          examples: [
            409
          ]
        },
        cause: {
          type: "string",
          examples: [
            "USER_ALREADY_EXISTS"
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
            "SIGN_UP_ERROR"
          ]
        }
      }
    }
  }
};

export {
  SignUpDocumentationSchema
};
