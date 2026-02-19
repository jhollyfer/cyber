// application/resources/modules/delete/delete.doc.ts
var DeleteModuleDocumentationSchema = {
  tags: [
    "Modules"
  ],
  summary: "Delete a module",
  description: "Soft-deletes a module by setting active to false. Requires ADMINISTRATOR role.",
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
    204: {
      description: "Module deleted successfully",
      type: "null"
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
  DeleteModuleDocumentationSchema
};
