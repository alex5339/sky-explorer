import { Link, NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/deep-sky-objects", label: "Deep Sky Objects" },
  { to: "/exoplanets", label: "Exoplanets" },
  { to: "/meteor-showers", label: "Meteor Showers" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-6 md:px-10">
      <Link to="/" className="text-2xl font-bold py-4 text-blue-950">
        <span className="text-blue-950">✨Night Sky Explorer</span>
      </Link>

      <nav className="flex flex-wrap">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `border-b-3 px-4 pt-5 pb-4 text-sm font-semibold ${
                isActive ? "border-yellow-500 text-blue-950" : "border-transparent text-slate-500 hover:text-blue-950"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
