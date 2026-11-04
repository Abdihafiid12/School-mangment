import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Users, User, UserRound, Clock, BookOpen } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}><Icon size={22} /></div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, teachers: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Soo qaado ardayda
      const { data: students } = await supabase.from("students").select("*").order("created_at", { ascending: false });
      // Soo qaado macalimiinta
      const { data: teachers } = await supabase.from("teachers").select("id");
      
      if (students) {
        const male = students.filter((s) => s.gender === "Male").length;
        const female = students.filter((s) => s.gender === "Female").length;
        setStats({ 
          total: students.length, 
          male, 
          female, 
          teachers: teachers ? teachers.length : 0 
        });
        setRecent(students.slice(0, 5));
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-slate-500">Loading dashboard…</div>;

  const pct = (n) => stats.total === 0 ? 0 : Math.round((n / stats.total) * 100);

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-slate-500 mb-6">Overview of your school data</p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={Users} label="Total Students" value={stats.total} color="bg-indigo-100 text-indigo-700" />
        <StatCard icon={BookOpen} label="Total Teachers" value={stats.teachers} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={User} label="Male Students" value={stats.male} color="bg-blue-100 text-blue-700" />
        <StatCard icon={UserRound} label="Female Students" value={stats.female} color="bg-pink-100 text-pink-700" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">Recently Registered Students</h2>
          {recent.length === 0 ? <p className="text-sm text-slate-500">No students yet.</p> : (
            <ul className="divide-y divide-slate-100">
              {recent.map((s) => (
                <li key={s.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {/* Halkan waxaa ku qoran sawirka haddii uu jiro */}
                    {s.avatar_url ? (
                      <img src={s.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {s.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{s.full_name}</p>
                      <p className="text-xs text-slate-500">{s.student_id} · {s.department}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 h-fit rounded-full ${
                    s.gender === "Male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                  }`}>{s.gender}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">Gender Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Male ({stats.male})</span><span>{pct(stats.male)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${pct(stats.male)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Female ({stats.female})</span><span>{pct(stats.female)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500" style={{ width: `${pct(stats.female)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}