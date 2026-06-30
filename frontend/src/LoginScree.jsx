import React, { useState } from "react";
import { signupUser, loginUser } from "./firebaseUtils";

// Hardcoded admin credentials — frontend only, no sensitive backend data
const ADMIN_EMAIL = "admin@ramenterprise.com";
const ADMIN_PASS  = "admin@123";

function LoginScreen({ onLogin, onAdminLogin }) {
  const [role, setRole]         = useState("user");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (role === "user" && isSignup && !userName.trim()) { setError("Please enter your name"); return; }
    if (!userEmail.trim()) { setError("Please enter your email"); return; }
    if (!userPass.trim())  { setError("Please enter your password"); return; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    if (!emailOk) { setError("Please enter a valid email"); return; }

    setLoading(true);
    try {
      // ── ADMIN LOGIN ──
      if (role === "admin") {
        if (userEmail.toLowerCase().trim() !== ADMIN_EMAIL) {
          setError("Invalid admin email"); return;
        }
        if (userPass.trim() !== ADMIN_PASS) {
          setError("Invalid admin password"); return;
        }
        onAdminLogin("Admin");
        return;
      }

      // ── USER SIGNUP ──
      if (isSignup) {
        if (userEmail.toLowerCase() === ADMIN_EMAIL) { setError("This email is reserved"); setLoading(false); return; }
        if (userPass.length < 8)                     { setError("Password must be at least 8 characters"); setLoading(false); return; }
        if (!/[A-Z]/.test(userPass) || !/[a-z]/.test(userPass) || !/[0-9]/.test(userPass)) {
          setError("Password must have uppercase, lowercase and a number"); setLoading(false); return;
        }
        const userData = await signupUser(userEmail, userPass, userName.trim());
        onLogin(userData.name);
        return;
      }

      // ── USER LOGIN ──
      const userData = await loginUser(userEmail, userPass);
      if (userData.isAdmin) {
        // Admin trying to log in as user → redirect to admin
        onAdminLogin(userData.name);
      } else {
        onLogin(userData.name);
      }

    } catch (err) {
      // Firebase error codes → friendly messages
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (code === "auth/email-already-in-use") {
        setError("Email already registered. Please login");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Check your connection");
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════
  // USER PANEL
  // ══════════════════════════════
  if (role === "user") {
    return (
      <div className="bg-cream-100 min-h-screen flex items-center justify-center px-6 py-16 animate-fadeIn">
        <div className="w-full max-w-md">

          {/* Role Switcher */}
          <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm">
            <button onClick={() => { setRole("user"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${role==="user" ? "bg-stone-900 text-white shadow-sm" : "text-stone-400 hover:text-stone-700"}`}>
              👤 Customer
            </button>
            <button onClick={() => { setRole("admin"); setError(""); setIsSignup(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${role==="admin" ? "bg-stone-900 text-white shadow-sm" : "text-stone-400 hover:text-stone-700"}`}>
              🛡️ Admin
            </button>
          </div>

          <div className="bg-white rounded-4xl shadow-card-lg p-8">
            <div className="mb-8">
              <div className="w-12 h-12 bg-cream-200 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="font-serif-display font-bold text-2xl text-stone-900 italic">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                {isSignup ? "Sign up to start shopping" : "Sign in to your account"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input required type="text" placeholder="Your name" value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full bg-cream-100 border-2 border-transparent focus:border-stone-900 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" placeholder="you@example.com" value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full bg-cream-100 border-2 border-transparent focus:border-stone-900 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Password</label>
                <input type="password" placeholder={isSignup ? "Min 8 chars (A-Z, a-z, 0-9)" : "Enter password"}
                  value={userPass} onChange={e => setUserPass(e.target.value)}
                  className="w-full bg-cream-100 border-2 border-transparent focus:border-stone-900 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all" />
                {isSignup && <p className="text-xs text-stone-400 mt-1.5">✓ Min 8 chars · ✓ Uppercase · ✓ Lowercase · ✓ Number</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-stone-900 text-white py-3.5 rounded-2xl text-sm font-semibold hover:bg-brand transition-all shadow-btn mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? "Please wait..." : isSignup ? "Create Account →" : "Sign In →"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-stone-400">
                {isSignup ? "Already have an account?" : "New to Ram Enterprise?"}
                <button onClick={() => { setIsSignup(!isSignup); setError(""); }}
                  className="text-stone-900 font-semibold ml-1 hover:underline">
                  {isSignup ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════
  // ADMIN PANEL
  // ══════════════════════════════
  return (
    <div className="bg-stone-900 min-h-screen flex items-center justify-center px-6 py-16 animate-fadeIn">
      <div className="relative w-full max-w-md">

        {/* Role Switcher */}
        <div className="flex gap-2 mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
          <button onClick={() => { setRole("user"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${role==="user" ? "bg-white text-stone-900 shadow-sm" : "text-white/40 hover:text-white"}`}>
            👤 Customer
          </button>
          <button onClick={() => { setRole("admin"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${role==="admin" ? "bg-white text-stone-900 shadow-sm" : "text-white/40 hover:text-white"}`}>
            🛡️ Admin
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-4xl p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="font-serif-display font-bold text-2xl text-white italic">Admin Access</h2>
            <p className="text-white/40 text-sm mt-1">Ram Enterprise Control Panel</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-2xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">Admin Email</label>
              <input required type="email" placeholder="admin@ramenterprise.com" value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 focus:border-white/40 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">Password</label>
              <input required type="password" placeholder="••••••••" value={userPass}
                onChange={e => setUserPass(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 focus:border-white/40 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-white text-stone-900 py-3.5 rounded-2xl text-sm font-semibold hover:bg-cream-200 transition-all shadow-btn mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <span className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />}
              {loading ? "Checking..." : "Access Admin Panel →"}
            </button>
          </form>
          <p className="text-center text-xs text-white/20 mt-6">Restricted access · Ram Enterprise 2026</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
