type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export default function TextInput({
    label,
    className = "",
    ...props
}: TextInputProps) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
                {label}
            </span>

            <input
                className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 ${className}`}
                {...props}
            />
        </label>
    );
}