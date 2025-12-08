"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../Database/supabase-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      // Get logged-in user
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push("/Login");
        return;
      }

      const u = userData.user;
      setUser(u);

      // Get login activity
      const { data: act } = await supabase
        .from("user_activity")
        .select("*")
        .eq("user_id", u.id)
        .order("date", { ascending: true });

      setActivity(act || []);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) return <p className="p-6 text-gray-700 text-center">Loading...</p>;
  if (!user) return null;

  // --------------- Heatmap (Last 60 Days) ---------------
  const today = new Date();

  const days = Array.from({ length: 60 }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const formatted = date.toISOString().split("T")[0];

    const active = activity.some((entry) => entry.date === formatted);

    return { date: formatted, active };
  }).reverse();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-8">

        {/* ---------------- HEADER SECTION ---------------- */}
        <div className="flex items-center gap-6 pb-6 border-b">
          <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user.user_metadata.full_name
              ? user.user_metadata.full_name[0].toUpperCase()
              : user.email[0].toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.user_metadata.full_name || "User"}
            </h2>

            <p className="text-gray-600">{user.email}</p>

            <p className="text-xs text-gray-500">
              Joined: {new Date(user.created_at).toDateString()}
            </p>
          </div>
        </div>

        {/* ---------------- ACTIVITY SECTION ---------------- */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Login Activity (Last 60 Days)
          </h3>

          <div className="grid grid-cols-15 gap-1">
            {days.map((d, i) => (
              <div
                key={i}
                title={d.date}
                className={`w-3 h-3 rounded-sm ${
                  d.active ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* ---------------- LOGOUT BUTTON ---------------- */}
        <div className="mt-10">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/Login");
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
