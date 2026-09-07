export default function Page({ params }: { params: { parcelId: string } }) {
  return (
    <div>
      <h2>Parcel: {params.parcelId}</h2>
      <p>Module: Land Parcels</p>
      <p>Page: Parcel details</p>
      <p>Purpose: Parcel details, geometry, status, associations (placeholder)</p>
      <strong>IMPLEMENTATION PENDING</strong>
    </div>
  )
}
