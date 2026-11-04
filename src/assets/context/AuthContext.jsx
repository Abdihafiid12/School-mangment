import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../supabase";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("Could not load the current session:", error);
      setSession(data.session);
      setLoading(false);
    }).catch((error) => {
      console.error("Could not load the current session:", error);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = (email, password) => {
    if (!supabase) {
      return Promise.resolve({
        error: new Error("Add your Supabase URL and publishable key to a .env file, then restart the app."),
      });
    }
    return supabase.auth.signInWithPassword({ email, password });
  };
  const signOut = () => supabase?.auth.signOut();

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);