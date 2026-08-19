export async function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-[100dvh] overflow-y-auto">{children}</div>
}

export default PublicLayout
