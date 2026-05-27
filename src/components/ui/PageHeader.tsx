type PageHeaderProps = {
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export default function PageHeader({
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="mb-4 flex items-center justify-between">
            {/* Left side: title + description */}
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-slate-500">{description}</p>
                )}
            </div>

            {/* Right side: action */}
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}