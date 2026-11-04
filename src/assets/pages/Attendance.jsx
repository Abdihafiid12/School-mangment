import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useToast } from "../components/Toast";

export default function Attendance() {
  const { push } = useToast();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    // Soo qaado ardayda
    const { data: stds } = await supabase.from("students").select("*").order("full_name");
    setStudents(stds || []);
    
    // Soo qaado xaadirinta maalintaas
    const { data: att } = await supabase.from("attendance").select("*").eq("date", date);
    setAttendance(att || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [date]);

  const markAttendance = async (studentId, status) => {
    const existing = attendance.find(a => a.student_id === studentId);
    
    if (existing) {
      const { error } = await supabase.from("attendance").update({ status }).eq("id", existing.id);
      if (error) push(error.message, "error");
      else {
        setAttendance(attendance.map(a => a.id === existing.id ? { ...a, status } : a));
        push("Attendance updated");
      }
    } else {
      const { data, error } = await supabase.from("attendance").insert([{ student_id: studentId, date, status }]).select();
      if (error) push(error.message, "error");
      else {
        setAttendance([...attendance, data[0]]);
        push("Attendance marked");
      }
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-slate-500 text-sm">Mark daily student attendance</p>
        </div>
        <div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Student ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>}
            {students.map((s) => {
              const record = attendance.find(a => a.student_id === s.id);
              return (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs">{s.student_id}</td>
                  <td className="p-4 font-medium">{s.full_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record?.status === 'Present' ? 'bg-green-100 text-green-700' : 
                      record?.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                      record?.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {record?.status || 'Not Marked'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => markAttendance(s.id, 'Present')} className={`px-3 py-1 rounded-lg text-xs font-medium ${record?.status === 'Present' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>Present</button>
                    <button onClick={() => markAttendance(s.id, 'Absent')} className={`px-3 py-1 rounded-lg text-xs font-medium ${record?.status === 'Absent' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>Absent</button>
                    <button onClick={() => markAttendance(s.id, 'Late')} className={`px-3 py-1 rounded-lg text-xs font-medium ${record?.status === 'Late' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}>Late</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}