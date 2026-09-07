export default function ProjectLayout({ children, params }: { children: React.ReactNode, params: { projectId: string } }) {
  return (
    <div>
      <h2>Project: {params.projectId}</h2>
      <nav style={{marginBottom:16}}>Project navigation (Overview | Timeline | Workflow | Parcels | Documents | Compensation | Possession | R-and-R | Reports | Audit)</nav>
      <section>{children}</section>
    </div>
  )
}
