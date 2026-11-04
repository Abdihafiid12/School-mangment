import { useEffect, useState } from "react";

const EMPTY = { student_id: "", full_name: "", gender: "Male", email: "", phone: "", department: "" };

export default function StudentForm({ open, initial, onCancel, onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [err, setErr] = useState("");

  useEffect(() => {
    setForm(initial ? { ...initial } : EMPTY);
    setErr("");
  }, [initial, open]);

  if (!open) return null;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

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
      <form onSubmit={submit}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {initial ? "Edit Student" : "Register New Student"}
        </h2>

        {err && <div className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">{err}</div>}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-600 mb-1 block">Student ID</span>
            <input value={form.student_id} onChange={update("student_id")} required disabled={!!initial}
              className="input" placeholder="STU-001" />
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
          <button type="button" onClick={onCancel} disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm bg-slate-100 hover:bg-slate-200">Cancel</button>
          <button type="submit" disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60">
            {submitting ? "Saving…" : initial ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}