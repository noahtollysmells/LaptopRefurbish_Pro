{
  "name": "RefurbProcessTemplate",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Template name"
    },
    "active": {
      "type": "boolean",
      "default": true,
      "description": "Whether template is active"
    },
    "ordered_steps": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "step_number": {
            "type": "number"
          },
          "step_title": {
            "type": "string"
          },
          "step_instructions": {
            "type": "string"
          },
          "acceptance_criteria": {
            "type": "string"
          },
          "required": {
            "type": "boolean"
          },
          "notes_allowed": {
            "type": "boolean"
          }
        }
      },
      "description": "Ordered list of refurbishment steps"
    }
  },
  "required": [
    "name"
  ]
}