import { useState } from "react"
import type { ErrorResponse } from "../types/ErrorResponse"

export function useFormErrors<T extends object>() {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string[]>>>({})
  const [generalErrors, setGeneralErrors] = useState<string[]>([])

  function applyErrors(error: ErrorResponse) {
    const fe: any = {}
    const ge: string[] = []

    for (const key in error.errors) {
      if (key === "general") {
        ge.push(...error.errors[key])
      } else {
        fe[key as keyof T] = error.errors[key]
      }
    }

    setFieldErrors(fe)
    setGeneralErrors(ge)
  }

  function clearErrors() {
    setFieldErrors({})
    setGeneralErrors([])
  }

  return {
    fieldErrors,
    generalErrors,
    applyErrors,
    clearErrors,
    // expose setters for client-side validation
    setFieldErrors,
    setGeneralErrors,
  }
}
