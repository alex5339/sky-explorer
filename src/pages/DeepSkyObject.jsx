import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api.js';
import { Loader, ErrorMessage, EmptyState } from '../components/Status.jsx';

const TYPES = ['Galaxy', 'Nebula', 'Cluster'];

const BAND_COLOURS = {
  Galaxy: 'bg-violet-500',
  Nebula: 'bg-pink-500',
  Cluster: 'bg-teal-600',
};

export default function DeepSkyObjects() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('');

  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (type) params.type = type;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/deep-sky-objects', { params });
        if (!ignore) setObjects(res.data);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      }
      if (!ignore) setLoading(false);
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [debouncedSearch, type, reloadKey]);

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-950">Deep-Sky Objects</h1>
      <p className="mt-2 mb-6 text-slate-500">
        Galaxies, nebulae and star clusters beyond our solar system.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <label htmlFor="search" className="text-sm font-semibold text-slate-500">
          Search (by name or constellation):
        </label>
        <input
          id="search"
          type="search"
          placeholder="e.g. taurus"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-yellow-500 focus:bg-white sm:w-60"
        />

        <label htmlFor="type" className="text-sm font-semibold text-slate-500">
          Filter by type:
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-yellow-500"
        >
          <option value="">All</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader text="Loading deep-sky objects…" />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={() => setReloadKey(reloadKey + 1)} />
      )}

      {!loading && !error && objects.length === 0 && (
        <EmptyState text="No deep-sky objects match your search." />
      )}

      {!loading && !error && objects.length > 0 && (
        <>
          <p className="mb-3 text-sm text-slate-500">{objects.length} object(s) found</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {objects.map((obj) => (
              <article key={obj.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div
                  className={`flex justify-between px-4 py-2 text-xs font-bold tracking-widest text-white uppercase ${BAND_COLOURS[obj.type]}`}
                >
                  <span>{obj.type}</span>
                  <span>{obj.catalogue}</span>
                </div>

                <div className="p-4">
                  <h3 className="mb-2 font-bold text-blue-950">{obj.name}</h3>
                  <div className="flex justify-between border-t border-dashed border-slate-200 py-2 text-sm">
                    <span className="text-slate-500">Constellation</span>
                    <span className="font-semibold">{obj.constellation}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 py-2 text-sm">
                    <span className="text-slate-500">Magnitude</span>
                    <span className="font-semibold">{obj.magnitude}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
