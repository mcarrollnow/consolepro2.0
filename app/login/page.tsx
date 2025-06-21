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

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
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
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Phone verified! Redirecting...");
        // Set a simple cookie (for demo; use httpOnly/session in production)
        document.cookie = `auth_phone=${encodeURIComponent(phone)}; path=/`;
        setTimeout(() => router.push("/"), 1000);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login with Mobile</h1>
        {step === "phone" && (
          <form onSubmit={sendCode} className="space-y-4">
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
              className="w-full border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              className="w-full text-blue-600 underline"
              onClick={() => setStep("phone")}
              disabled={loading}
            >
              Change phone number
            </button>
          </form>
        )}
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mt-4 text-center">{success}</div>}
      </div>
    </div>
  );
} 