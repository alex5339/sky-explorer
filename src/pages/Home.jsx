import { Link } from "react-router-dom";

const LINKS = [
  { to: "/deep-sky-objects", title: "Deep Sky Objects", text: "Search galaxies, nebulae and star clusters" },
  { to: "/exoplanets", title: "Exoplanets", text: "Sort and page through worlds around other stars" },
  { to: "/meteor-showers", title: "Meteor Showers", text: "Find showers by peak month and hemisphere" },
];

export default function Home() {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 px-6 py-16 text-center bg-linear-to-br from-purple-100 via-white to-teal-100">
        <p className="text-xs font-bold tracking-[0.25em] text-yellow-700 uppercase">Observe ・ Discover ・ Wonder</p>
        <p className="mt-3 mb-4 text-3xl font-extrabold text-blue-950 md:text-5xl">Welcome to the Night Sky Explorer</p>
        <p className="mx-auto max-w-lg text-slate-500 leading-relaxed">
          Your guide to what is up there tonight. Pick a category below to start exploring the observatory catalogue
        </p>
      </section>

      <section className="mt-7 grid gap-5 md:grid-cols-3">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-2xl border border-t-4 border-slate-200 border-t-yellow-500 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-bold text-blue-950">{link.title}</h2>
            <p className="mb-4 text-md text-slate-500">{link.text}</p>
            <span className="text-sm font-bold text-yellow-700">Explore →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
