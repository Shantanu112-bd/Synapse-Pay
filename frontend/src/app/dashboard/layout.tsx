export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#000] text-gray-200">
            {children}
        </div>
    );
}
