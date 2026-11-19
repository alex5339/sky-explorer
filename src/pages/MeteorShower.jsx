import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api.js";
import { Loader, ErrorMessage, EmptyState } from "../components/Status.jsx";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const LOCATION = ["Northern", "Southern", "Both"];

function ChipRow({ label, options, selected, onSelect }) {
  const allOptions = [{ value: "", label: "All" }, ...options];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-28 text-sm font-semibold text-slate-500">{label}</span>
      {allOptions.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onSelect(opt.value)}
          className={`rounded-full border px-3.5 py-1 text-sm font-semibold ${
            selected === opt.value ?
              "border-teal-600 bg-teal-600 text-white"
            : "border-slate-200 bg-white text-slate-500 hover:border-teal-600 hover:text-teal-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function MeteorShower() {
  const [month, setMonth] = useState("");
  const [location, setLocation] = useState("");

  const [meteors, setMeteors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const params = {};
    if (month) params.month = month;
    if (location) params.hemisphere = location;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/meteor-showers", { params });
        if (!ignore) setMeteors(res.data);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      }
      if (!ignore) setLoading(false);
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [month, location, reloadKey]);

  const monthOptions = MONTHS.map((m) => ({ value: m, label: m.slice(0, 3) }));
  const locationOptions = LOCATION.map((l) => ({ value: l, label: l }));
  return (
    <>
      <h1 className="text-3xl font-bold text-blue-950">Meteor Showers</h1>
      <p className="mt-2 mb-6 text-slate-500">Yearly showers with when, and where to watch them</p>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <ChipRow label="Peak month" options={monthOptions} selected={month} onSelect={setMonth} />
        <ChipRow label="Location" options={locationOptions} selected={location} onSelect={setLocation} />
      </div>

      {loading && <Loader text="Loading meteor showers..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={() => setReloadKey(reloadKey + 1)} />}

      {!loading && !error && meteors.length === 0 && <EmptyState text="No meteor showers found." />}

      {!loading && !error && meteors.length > 0 && (
        <ul className="grid gap-3">
          {meteors.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5">
              <div className="min-w-16 rounded-lg bg-amber-100 px-3 py-1.5 text-center">
                <strong className="block text-xl text-yellow-700">{m.peakRate}</strong>
                <span className="text-xs text-slate-500">per hour</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-950">{m.name}</h3>
                <p className="text-sm text-slate-500">Parent body: {m.parentBody}</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-semibold text-violet-700">{m.month}</span>
                <span className="rounded-full border bg-teal-400 px-3 py-1 text-xs font-semibold text-teal-600">{m.hemisphere}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
