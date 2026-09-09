export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div>
      <h2>Project: {projectId}</h2>
      <nav style={{marginBottom:16}}>Project navigation (Overview | Timeline | Workflow | Parcels | Documents | Compensation | Possession | R-and-R | Reports | Audit)</nav>
      <section>{children}</section>
    </div>
  )
}
