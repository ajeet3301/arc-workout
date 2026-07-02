export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-secondary mb-1">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}
