import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useToast } from "./Toast"; // Hubi in Toast uu halkan yaalo

const EMPTY = { student_id: "", full_name: "", gender: "Male", email: "", phone: "", department: "", avatar_url: "" };

export default function StudentForm({ open, initial, onCancel, onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    setForm(initial ? { ...initial } : EMPTY);
    setErr("");
  }, [initial, open]);

  if (!open) return null;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Qaybta sawirka soo gelinta (Upload Photo)
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    // Soo geli sawirka Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    
    if (uploadError) {
      push(uploadError.message, "error");
      setUploading(false);
      return;
    }

    // Hel link-ga sawirka
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setForm({ ...form, avatar_url: publicUrl });
    setUploading(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.student_id.trim() || !form.full_name.trim()) {
      return setErr("Student ID and Full Name are required.");
    }
    setErr("");
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <form onSubmit={submit} className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{initial ? "Edit Student" : "Register New Student"}</h2>

        {err && <div className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">{err}</div>}

        {/* Qaybta Sawirka */}
        <div className="mb-6 flex flex-col items-center">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover mb-2 border" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 border border-dashed text-xs">No Photo</div>
          )}
          <label className="cursor-pointer bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200">
            {uploading ? "Uploading..." : "Upload Photo"}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Student ID</span>
            <input value={form.student_id} onChange={update("student_id")} required disabled={!!initial} className="input" placeholder="STU-001" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Full Name</span>
            <input value={form.full_name} onChange={update("full_name")} required className="input" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Gender</span>
            <select value={form.gender} onChange={update("gender")} className="input">
              <option>Male</option><option>Female</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Email</span>
            <input type="email" value={form.email} onChange={update("email")} required className="input" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Phone</span>
            <input value={form.phone} onChange={update("phone")} required className="input" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Class / Department</span>
            <input value={form.department} onChange={update("department")} required className="input" />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onCancel} disabled={submitting} className="px-4 py-2 rounded-lg text-sm bg-slate-100 hover:bg-slate-200">Cancel</button>
          <button type="submit" disabled={submitting || uploading} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60">
            {submitting ? "Saving…" : initial ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}