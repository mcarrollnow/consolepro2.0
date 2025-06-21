"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  function formatPhone(phone: string) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (phone.startsWith('+')) return phone;
    return phone;
  }

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formattedPhone = formatPhone(phone);
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("code");
        setSuccess("Verification code sent!");
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formattedPhone = formatPhone(phone);
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, code }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Phone verified! Redirecting...");
        document.cookie = `auth_phone=${encodeURIComponent(formattedPhone)}; path=/`;
        setTimeout(() => window.location.href = "/", 1000);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/20 to-purple-900/20 pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-lg p-8 w-full backdrop-blur">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Login with Mobile</h1>
          {step === "phone" && (
            <form onSubmit={sendCode} className="space-y-4">
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border border-slate-700 bg-slate-900/60 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold shadow"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>
          )}
          {step === "code" && (
            <form onSubmit={verifyCode} className="space-y-4">
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full border border-slate-700 bg-slate-900/60 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 font-semibold shadow"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                className="w-full text-cyan-400 underline hover:text-cyan-300"
                onClick={() => setStep("phone")}
                disabled={loading}
              >
                Change phone number
              </button>
            </form>
          )}
          {error && <div className="text-red-400 mt-4 text-center font-medium">{error}</div>}
          {success && <div className="text-green-400 mt-4 text-center font-medium">{success}</div>}
        </div>
      </div>
    </div>
  );
} 