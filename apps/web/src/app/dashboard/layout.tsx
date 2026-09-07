export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{display:'flex'}}>
      <aside style={{width:240,padding:20,borderRight:'1px solid #eee'}}>Sidebar (placeholder)</aside>
      <main style={{flex:1,padding:20}}>{children}</main>
    </div>
  )
}
