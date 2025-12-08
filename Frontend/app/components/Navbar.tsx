"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../Database/supabase-client";

type NavbarProps = {
  username?: string;
};

export default function Navbar({ username: propUsername }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { isLoggedin, loading, setIsLoggedin } = useAuth();

  const [displayName, setDisplayName] = useState<string | null>(
    propUsername ?? null
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  // ⭐ Close dropdown when clicking outside
  useEffect(() => {
    const closeMenu = () => setOpenDropdown(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // ⭐ Fetch logged-in user name
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedin) {
        setDisplayName(null);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setDisplayName(null);
        return;
      }

      const fullName =
        (user.user_metadata as any)?.full_name ??
        user.email?.split("@")[0] ??
        "User";

      setDisplayName(fullName);
    };

    if (!loading) fetchUser();
  }, [isLoggedin, loading]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const linkClasses = (path: string) =>
    `group relative px-4 py-1.5 text-xs md:text-sm font-medium rounded-full 
     transition-all duration-200 cursor-pointer hover:scale-110
     ${
       pathname === path
         ? "bg-black text-white shadow-lg"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedin(false);
    router.push("/");
  };

  const handleNavClick = (path: string) => router.push(path);

  return (
    <>
      <nav className="sticky top-0 w-full z-30 flex items-center justify-between px-8 pt-4 pb-3 bg-transparent">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            Posture<span className="text-blue-600">IQ</span>
          </h1>
          <img src="/Brand Logo.png" alt="PostureIQ logo" className="h-10 w-10" />
        </div>

        {/* CENTER NAV (Desktop) */}
        <div className="hidden sm:flex items-center gap-1 bg-white/80 backdrop-blur-xl rounded-full 
                        shadow-lg border border-white/70 px-3 py-1.5 absolute left-1/2 -translate-x-1/2">
          <a href="/workouts" className={linkClasses("/workouts")}>Workouts</a>
          <a href="/history" className={linkClasses("/history")}>History</a>
          <a href="/" className={linkClasses("/")}>Home</a>
          <a href="/Dashboard" className={linkClasses("/Dashboard")}>Dashboard</a>
          <a href="/feedback" className={linkClasses("/feedback")}>Feedback</a>
        </div>

        {/* RIGHT SECTION (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {loading ? (
            // ⭐ Skeleton while checking auth state
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
          ) : isLoggedin ? (
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(!openDropdown);
                }}
                className="size-10 rounded-full flex items-center justify-center 
                          text-sm md:text-base font-semibold bg-gray-800 text-white 
                          shadow-md hover:bg-gray-900 active:scale-95 transition"
              >
                {displayName ? displayName[0].toUpperCase() : "U"}
              </button>

              {/* DROPDOWN MENU */}
              {openDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl 
                             border border-gray-200 py-2 z-50"
                >
                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      router.push("/Profile");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      router.push("/history");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    History
                  </button>

                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      router.push("/settings");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Settings
                  </button>

                  <hr className="my-1 border-gray-200" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/Login"
                className={`px-4 py-1.5 text-xs md:text-sm font-medium rounded-full transition-all ${
                  pathname === "/Login"
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-700 bg-white/80 hover:bg-gray-200"
                }`}
              >
                Login
              </a>

              <a
                href="/Signup"
                className="px-4 py-1.5 text-xs md:text-sm font-semibold rounded-full 
                           bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md
                           hover:shadow-lg transition"
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-1 rounded-full bg-white/80 shadow-md text-gray-700"
          >
            {isMenuOpen ? "Close" : "Menu"} {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN PANEL */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-16 inset-x-0 z-20 px-4">
          <div className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200 py-3">
            {/* NAV LINKS */}
            <div className="flex flex-col gap-1 px-2">
              <button onClick={() => handleNavClick("/")} className="w-full text-left px-3 py-2 rounded-xl">
                Home
              </button>
              <button onClick={() => handleNavClick("/workouts")} className="w-full text-left px-3 py-2 rounded-xl">
                Workouts
              </button>
              <button onClick={() => handleNavClick("/history")} className="w-full text-left px-3 py-2 rounded-xl">
                History
              </button>
              <button onClick={() => handleNavClick("/Dashboard")} className="w-full text-left px-3 py-2 rounded-xl">
                Dashboard
              </button>
              <button onClick={() => handleNavClick("/feedback")} className="w-full text-left px-3 py-2 rounded-xl">
                Feedback
              </button>
            </div>

            <div className="my-2 h-px bg-gray-200" />

            {/* MOBILE AUTH SECTION */}
            <div className="px-3 flex flex-col gap-2">
              {loading ? (
                <div className="w-full h-8 bg-gray-300 animate-pulse rounded-xl" />
              ) : isLoggedin ? (
                <>
                  <span className="text-xs text-gray-700">
                    Logged in as <span className="font-semibold">{displayName}</span>
                  </span>
                  <button onClick={() => router.push("/Profile")} className="text-left px-3 py-2">Profile</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick("/Login")}
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 text-white"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick("/Signup")}
                    className="w-full px-3 py-2 rounded-xl bg-blue-600 text-white"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
