export default function Loading({ label = 'Preparing portfolio intelligence...' }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
}
