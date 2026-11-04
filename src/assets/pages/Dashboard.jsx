import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-lg sm:p-12">
        <div className="mb-6 inline-flex rounded-xl bg-white/15 p-3">
          <GraduationCap size={30} />
        </div>
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-100">
          School Management System
        </p>
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Welcome to your dashboard</h1>
        <p className="mb-8 max-w-xl text-indigo-100">
          Manage student records and keep your school information organized in one place.
        </p>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
        >
          View students <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}