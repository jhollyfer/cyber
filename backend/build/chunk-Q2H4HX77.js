// application/resources/stats/find-all-students/find-all-students.doc.ts
var FindAllStudentsDocumentationSchema = {
  tags: [
    "Stats"
  ],
  summary: "Get detailed student list (Admin)",
  description: "Returns list of all students with their grades per module",
  response: {
    200: {
      description: "Students with grades",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          name: {
            type: "string"
          },
          phone: {
            type: "string"
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          average_nota: {
            type: "number"
          },
          modules_completed: {
            type: "number"
          },
          modules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                module_id: {
                  type: "string"
                },
                module_title: {
                  type: "string"
                },
                nota: {
                  type: "number"
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
                finished_at: {
                  type: "string",
                  format: "date-time",
                  nullable: true
                }
              }
            }
          }
        }
      }
    }
  }
};

export {
  FindAllStudentsDocumentationSchema
};
