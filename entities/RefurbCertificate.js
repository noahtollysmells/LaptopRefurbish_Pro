{
  "name": "RefurbCertificate",
  "type": "object",
  "properties": {
    "certificate_number": {
      "type": "string",
      "description": "Auto-generated certificate number"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Certificate date"
    },
    "technician_name": {
      "type": "string",
      "description": "Name of the technician"
    },
    "manufacturer": {
      "type": "string",
      "enum": [
        "Lenovo",
        "Dell",
        "HP",
        "Other"
      ],
      "description": "Laptop manufacturer"
    },
    "model": {
      "type": "string",
      "description": "Laptop model"
    },
    "serial_number": {
      "type": "string",
      "description": "Device serial number"
    },
    "physical_condition_grade": {
      "type": "string",
      "enum": [
        "A",
        "B",
        "C"
      ],
      "description": "Physical condition grade"
    },
    "physical_condition_notes": {
      "type": "string",
      "description": "Notes about physical condition"
    },
    "condition_testing_notes": {
      "type": "string",
      "description": "Notes about testing"
    },
    "tests_performed": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of tests performed"
    },
    "tests_other": {
      "type": "string",
      "description": "Other tests performed"
    },
    "operating_system": {
      "type": "string",
      "enum": [
        "Windows",
        "Linux"
      ],
      "description": "Installed OS type"
    },
    "windows_version": {
      "type": "string",
      "enum": [
        "Windows 10 Pro",
        "Windows 11 Pro",
        "Windows 10 Home",
        "Windows 11 Home"
      ],
      "description": "Windows version if applicable"
    },
    "linux_distribution": {
      "type": "string",
      "description": "Linux distribution if applicable"
    },
    "os_notes": {
      "type": "string",
      "description": "Operating system notes"
    },
    "software_work": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Software work completed"
    },
    "software_other": {
      "type": "string",
      "description": "Other software work"
    },
    "technical_specifications": {
      "type": "string",
      "description": "Technical specifications"
    },
    "other_description": {
      "type": "string",
      "description": "Other device description"
    },
    "sale_price_gbp": {
      "type": "number",
      "description": "Sale price in GBP"
    },
    "customer_order_reference": {
      "type": "string",
      "description": "Customer order reference"
    },
    "status": {
      "type": "string",
      "enum": [
        "Draft",
        "Completed"
      ],
      "default": "Draft",
      "description": "Certificate status"
    }
  },
  "required": [
    "certificate_number",
    "date",
    "technician_name",
    "manufacturer",
    "model"
  ]
}