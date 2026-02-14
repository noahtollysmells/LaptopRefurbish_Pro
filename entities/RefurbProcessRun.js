{
  "name": "RefurbProcessRun",
  "type": "object",
  "properties": {
    "certificate_id": {
      "type": "string",
      "description": "Linked RefurbCertificate ID"
    },
    "template_id": {
      "type": "string",
      "description": "Linked RefurbProcessTemplate ID"
    },
    "started_at": {
      "type": "string",
      "format": "date-time",
      "description": "When the process started"
    },
    "completed_at": {
      "type": "string",
      "format": "date-time",
      "description": "When the process completed"
    },
    "status": {
      "type": "string",
      "enum": [
        "Not Started",
        "In Progress",
        "Completed"
      ],
      "default": "Not Started",
      "description": "Current status"
    },
    "current_step": {
      "type": "number",
      "default": 1,
      "description": "Current step number"
    }
  },
  "required": [
    "certificate_id"
  ]
}