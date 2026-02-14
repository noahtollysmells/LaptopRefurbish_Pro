{
  "name": "RefurbStepResult",
  "type": "object",
  "properties": {
    "process_run_id": {
      "type": "string",
      "description": "Linked RefurbProcessRun ID"
    },
    "step_number": {
      "type": "number",
      "description": "Step number"
    },
    "completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether step is completed"
    },
    "completed_by": {
      "type": "string",
      "description": "Who completed the step"
    },
    "completed_at": {
      "type": "string",
      "format": "date-time",
      "description": "When step was completed"
    },
    "notes": {
      "type": "string",
      "description": "Step notes"
    }
  },
  "required": [
    "process_run_id",
    "step_number"
  ]
}