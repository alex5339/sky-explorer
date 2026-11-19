import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api.js";
import { Loader, ErrorMessage, EmptyState } from "../components/Status.jsx";

const SORT_OPTIONS = [
  { value: "", label: "None" },
  { value: "name", label: "Name" },
  { value: "popularity", label: "Distance" },
];
const LIMIT_OPTIONS = [5, 10, 15];

const toggleClass = (selected) =>
  `px-4 py-1.5 text-sm font-semibold border-r border-slate-200 last:border-r-0 ${
    selected ? "bg-yellow-500 text-blue-950" : "bg-white hover:bg-slate-50"
  }`;

const pageClass = (selected) =>
  `min-w-9 rounded-lg border px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed ${
    selected ?
      "border-yellow-500 bg-yellow-500 text-blue-950"
    : "border-slate-200 bg-white text-blue-950 hover:border-yellow-500 disabled:text-slate-300 disabled:hover:border-slate-200"
  }`;

export default function Exoplanet() {
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [exoplanets, setExoplanets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const params = { page, limit };
    if (sort) params.sort = sort;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/exoplanets", { params });
        if (!ignore) {
          setExoplanets(res.data.data);
          setTotalPages(res.data.totalPages);
          setTotal(res.data.total);
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      }
      if (!ignore) setLoading(false);
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [sort, limit, page, reloadKey]);

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };
  const changeLimit = (value) => {
    setLimit(value);
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-950">Exoplanets</h1>
      <p className="mt-2 mb-6 text-slate-500">Planets that orbit stars other than our Sun.</p>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <span className="text-sm font-semibold text-slate-500">Sort by</span>
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-200">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.label} onClick={() => changeSort(opt.value)} className={toggleClass(sort === opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>

        <span className="text-sm font-semibold text-slate-500">Per page</span>
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-200">
          {LIMIT_OPTIONS.map((n) => (
            <button key={n} onClick={() => changeLimit(n)} className={toggleClass(limit === n)}>
              {n}
            </button>
          ))}
        </div>
      </div>
      {loading && <Loader text="Loading exoplanets..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={() => setReloadKey(reloadKey + 1)} />}

      {!loading && !error && exoplanets.length === 0 && <EmptyState text="No exoplanets found." />}

      {!loading && !error && exoplanets.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead className="border-b-2 border-yellow-500 bg-amber-100 text-xs tracking-widest text-blue-950 uppercase">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Host Star</th>
                <th className="px-5 py-3 text-right">Distance (LY)</th>
                <th className="px-5 py-3">Planet Type</th>
                <th className="px-5 py-3 text-right">Discovered</th>
              </tr>
            </thead>
            <tbody>
              {exoplanets.map((e) => (
                <tr key={e.id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-bold text-blue-950">{e.name}</td>
                  <td className="px-5 py-3">{e.hostStar}</td>
                  <td className="px-5 py-3 text-right">{e.distance}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">{e.planetType}</span>
                  </td>
                  <td className="px-5 py-3 text-right">{e.discoveryYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!error && totalPages > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages} · {total} exoplanets
          </span>

          <div className="flex flex-wrap gap-1.5">
            <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)} className={pageClass(false)}>
              ‹ Prev
            </button>

            {pageNumbers.map((n) => (
              <button key={n} disabled={loading} onClick={() => setPage(n)} className={pageClass(n === page)}>
                {n}
              </button>
            ))}

            <button disabled={page === totalPages || loading} onClick={() => setPage(page + 1)} className={pageClass(false)}>
              Next ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
