import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase";
import { useToast } from "../components/Toast";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

const EMPTY = { teacher_id: "", full_name: "", gender: "Male", email: "", phone: "", subject: "" };

export default function Teachers() {
  const { push } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("teachers").select("*").order("created_at", { ascending: false });
    if (error) push(error.message, "error");
    else setTeachers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachers.filter((t) => !q || t.teacher_id.toLowerCase().includes(q) || t.full_name.toLowerCase().includes(q));
  }, [teachers, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (editing) {
      const { error } = await supabase.from("teachers").update(form).eq("id", editing.id);
      if (error) push(error.message, "error");
      else { push("Teacher updated"); setFormOpen(false); load(); }
    } else {
      const { error } = await supabase.from("teachers").insert([form]);
      if (error) push(error.message, "error");
      else { push("Teacher added"); setFormOpen(false); load(); }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ma hubtaa inaad tirtirto macalinkan?")) return;
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) push(error.message, "error");
    else { push("Teacher deleted"); load(); }
  };

  const openEdit = (t) => { setEditing(t); setForm(t); setFormOpen(true); };
  const openAdd = () => { setEditing(null); setForm(EMPTY); setFormOpen(true); };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-slate-500 text-sm">{teachers.length} total records</p>
        </div>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <Plus size={16} /> Add Teacher
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Teacher ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">No teachers found.</td></tr>}
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">{t.teacher_id}</td>
                <td className="p-4 font-medium">{t.full_name}</td>
                <td className="p-4">{t.subject}</td>
                <td className="p-4">{t.phone}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => openEdit(t)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg"><Pencil size={16}/></button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">{editing ? "Edit Teacher" : "Add Teacher"}</h2>
            <div className="grid gap-3">
              <input required value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})} placeholder="Teacher ID" className="input" disabled={!!editing} />
              <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Full Name" className="input" />
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="input">
                <option>Male</option><option>Female</option>
              </select>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="input" />
              <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" className="input" />
              <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Subject (e.g. Math)" className="input" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">{submitting ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}