import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const link = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition";

export default function Sidebar() {
  const { signOut } = useAuth();
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col p-4 min-h-screen">
      <div className="flex items-center gap-2 px-2 py-4 mb-4">
        <GraduationCap className="text-indigo-400" />
        <span className="font-bold text-lg">SMS Admin</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <NavLink to="/" end
          className={({ isActive }) => `${link} ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/students"
          className={({ isActive }) => `${link} ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
          <Users size={18} /> Students
        </NavLink>
      </nav>
      <button onClick={signOut}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600/80 text-red-200">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}