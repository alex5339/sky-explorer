export function Loader({ text = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-3 border-slate-200 border-t-yellow-500" />
      {text}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
      <span>
        <strong>Something went wrong.</strong> {message}
      </span>
      <button
        onClick={onRetry}
        className="rounded-lg border border-red-700 bg-white px-4 py-1.5 font-semibold hover:bg-red-100"
      >
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ text = 'No results found.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
      {text}
    </div>
  );
}