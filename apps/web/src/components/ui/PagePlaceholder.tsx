export default function PagePlaceholder({ module, title, purpose }: { module: string, title: string, purpose: string }) {
  return (
    <div style={{padding:20,border:'1px solid #ddd',borderRadius:8}}>
      <h4>{module}</h4>
      <h2>{title}</h2>
      <p>{purpose}</p>
      <strong>IMPLEMENTATION PENDING</strong>
    </div>
  )
}
