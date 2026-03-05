import React from 'react'

 type Validation = {
      id: number
      type: "minLength" | "maxLength" | "contains" | "notContains" | "pattern"
      value: string
    }

    type FieldItem = {
      id: string
      type: string
      name: string
      label: string
      placeholder?: string
      required?: boolean
      validations?: Validation[]
      options?: { id: number; value: string }[]
    }

export function FormPreview({
  fields,
  readOnly = false,
}: {
  fields: FieldItem[]
  readOnly?: boolean
}) {
  if (fields.length === 0)
    return <p className="text-muted-foreground">No fields added yet.</p>

  return (
    <form className="space-y-4">
      {fields.map((field) => {
        switch (field.type) {
          case "Text":
          case "Email":
          case "Number":
          case "Phone":
          case "URL":
          case "Date":
            return (
              <div key={field.id} className="flex flex-col">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && "*"}
                </label>
                <input
                  type={field.type.toLowerCase()}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={readOnly}
                  className="border rounded-md px-3 py-2 bg-white disabled:bg-gray-100"
                />
              </div>
            )
          case "Textarea":
            return (
              <div key={field.id} className="flex flex-col">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && "*"}
                </label>
                <textarea
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={readOnly}
                  className="border rounded-md px-3 py-2 bg-white disabled:bg-gray-100"
                />
              </div>
            )
          case "Checkbox":
            return (
                <div key={field.id} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{field.label}{field.required && "*"}</span>
                {(field.options || []).map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name={field.name} disabled={readOnly} />
                    {opt.value}
                    </label>
                ))}
                </div>
            )

        case "Select":
        return (
            <div key={field.id} className="flex flex-col gap-1">
            <label className="text-sm font-medium">{field.label}{field.required && "*"}</label>
            <select name={field.name} disabled={readOnly} className="border rounded-md px-3 py-2 bg-white disabled:bg-gray-100">
                {(field.options || []).map((opt) => (
                <option key={opt.id} value={opt.value}>{opt.value}</option>
                ))}
            </select>
            </div>
        )
          case "File":
            return (
              <div key={field.id} className="flex flex-col">
                <label>{field.label}</label>
                <input type="file" required={field.required} disabled={readOnly} />
              </div>
            )
          default:
            return null
        }
      })}
    </form>
  )
}
