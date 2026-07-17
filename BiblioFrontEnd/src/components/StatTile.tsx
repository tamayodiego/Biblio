export function StatTile({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-muted px-4 py-6">
      <span className="text-2xl font-semibold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
