export function ServerErrorAlert({ errors }: { errors: string[] }) {
  if (!errors.length) return null

  return (
    <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
      {errors.map((e, i) => (
        <p key={i}>{e}</p>
      ))}
    </div>
  )
}
