export async function PublicLayout({ children }: { children: React.ReactNode }) {
  // no overflow here: overflow-y-auto forced overflow-x to compute to `auto` too, which turned any
  // slightly-too-wide child into an inner horizontal scrollbar that body{overflow-x:hidden} can't catch
  return <div className="flex flex-col min-h-[100dvh]">{children}</div>
}

export default PublicLayout
