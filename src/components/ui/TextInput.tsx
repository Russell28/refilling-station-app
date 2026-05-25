type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string | null
  helperText?: string
}

export default function TextInput({
  label,
  error,
  helperText,
  className = "",
  ...props
}: TextInputProps) {
  const errorStyle = error
    ? "border-red-500 focus:border-red-600"
    : "border-slate-300 focus:border-slate-900"

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        className={`w-full rounded-lg bg-white px-3 py-2 text-sm outline-none border ${errorStyle} ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </label>
  )
}
