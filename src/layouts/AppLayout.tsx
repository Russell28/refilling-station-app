type Props = {
    children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
    return (
        <div>
            <header
                style={{
                    background: "white",
                    borderBottom: "1px solid #ddd",
                    padding: 16,
                }}
            >
                <strong>Water Refilling Station</strong>
            </header>

            <main style={{ padding: 20 }}>{children}</main>
        </div>
    );
}