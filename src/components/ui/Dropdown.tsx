// Dropdown.tsx
import React from "react";

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { id: number; name: string;[key: string]: any }[];
  valueField?: "id" | "name"; // defaults to "id"
  className?: string;
  error?: string;
}

export default function Dropdown({
  label,
  options,
  valueField = "name",
  className = "",
  error,
  ...props
}: DropdownProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <select
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 ${className}`}
        {...props}
      >
        {/* <option value="">Select an option</option> */}
        {options.map((opt) => (
          <option key={opt[valueField]} value={opt[valueField]}>
            {opt.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}
