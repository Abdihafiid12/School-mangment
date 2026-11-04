import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase";
import { useToast } from "../components/Toast";
import StudentForm from "../components/StudentForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

export default function Students() {
  const { push } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*")
      .order("created_at", { ascending: false });
    if (error) push(error.message, "error");
    else setStudents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesSearch = !q ||
        s.student_id.toLowerCase().includes(q) ||
        s.full_name.toLowerCase().includes(q);
      const matchesGender = gender === "All" || s.gender === gender;
      return matchesSearch && matchesGender;
    });
  }, [students, search, gender]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (s) => { setEditing(s); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    if (editing) {
      const { error } = await supabase.from("students").update({
        full_name: form.full_name, gender: form.gender, email: form.email,
        phone: form.phone, department: form.department,
      }).eq("id", editing.id);
      if (error) push(error.message, "error");
      else { push("Student updated"); setFormOpen(false); load(); }
    } else {
      const { error } = await supabase.from("students").insert([form]);
      if (error) push(error.message, "error");
      else { push("Student registered"); setFormOpen(false); load(); }
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("students").delete().eq("id", deleteTarget.id);
    if (error) push(error.message, "error");
    else { push("Student deleted"); load(); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-slate-500 text-sm">{students.length} total records</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-100">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or name…"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option>All</option><option>Male</option><option>Female</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && <tr><td colSpan={8} className="p-6 text-center text-slate-500">Loading students…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-slate-500">No students found.</td></tr>
              )}
              {!loading && filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.student_id}</td>
                 <td className="px-4 py-3 font-medium flex items-center gap-3">
  {s.avatar_url ? (
    <img src={s.avatar_url} alt={s.full_name} className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
      {s.full_name.charAt(0)}
    </div>
  )}
  {s.full_name}
</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      s.gender === "Male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                    }`}>{s.gender}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.email}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{s.department}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(s)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(s)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentForm open={formOpen} initial={editing} submitting={submitting}
        onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDialog open={!!deleteTarget} loading={deleting}
        title="Delete student?"
        message={`This will permanently remove ${deleteTarget?.full_name ?? ""} from the database.`}
        onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}