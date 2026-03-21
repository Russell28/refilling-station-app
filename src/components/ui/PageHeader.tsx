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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h2>

                {description && (
                    <p className="text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="sm:shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}