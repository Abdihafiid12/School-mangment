import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, GraduationCap, BookOpen, CheckSquare, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const link = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition";

export default function Sidebar() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <aside className="relative z-30 bg-slate-900 text-slate-100 md:sticky md:top-0 md:flex md:min-h-screen md:w-64 md:shrink-0 md:flex-col">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-indigo-400" />
          <span className="text-lg font-bold">SMS Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((isOpen) => !isOpen)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="rounded-lg p-2 hover:bg-slate-800 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-t border-slate-700 bg-slate-900 p-4 shadow-lg md:static md:flex md:flex-1 md:border-0 md:p-4 md:pt-0 md:shadow-none`}>
        <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `${link} ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/students" onClick={closeMenu} className={({ isActive }) => `${link} ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
          <Users size={18} /> Students
        </NavLink>
        <NavLink to="/teachers" onClick={closeMenu} className={({ isActive }) => `${link} ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
          <BookOpen size={18} /> Teachers
        </NavLink>
        <NavLink to="/attendance" onClick={closeMenu} className={({ isActive }) => `${link} ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
          <CheckSquare size={18} /> Attendance
        </NavLink>
        <button onClick={signOut} className="mt-4 flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-200 hover:bg-red-600/80 md:mt-auto">
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
}