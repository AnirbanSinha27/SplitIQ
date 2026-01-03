export default function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex">
        <aside className="w-64 border-r p-4">
          <h2 className="font-semibold">SplitIQ</h2>
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    );
  }