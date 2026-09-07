export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{padding:12,borderBottom:'1px solid #eee'}}>Topbar (placeholder)</header>
      <div style={{display:'flex'}}>
        <nav style={{width:220,borderRight:'1px solid #eee',padding:12}}>Sidebar navigation (placeholder)</nav>
        <main style={{flex:1,padding:12}}>{children}</main>
      </div>
    </div>
  )
}
