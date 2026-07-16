export function Bool({ value }: { value: unknown }) {
  return value ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Yes</span>
  ) : (
    <span className="rounded-full bg-nude-100 px-2 py-0.5 text-xs text-ink-500">No</span>
  );
}
