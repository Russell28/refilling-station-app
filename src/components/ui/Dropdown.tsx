// Dropdown.tsx
import React from "react";

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { id: number; name: string }[];
  className?: string;
}

export default function Dropdown({
  label,
  options,
  className = "",
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
          <option key={opt.id} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </label>
  );
}
