import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
}

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const API_BASE = "https://notetaking-backend-efiw.onrender.com";

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [step, setStep] = useState<"form" | "otp">("form");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);

  // 👇 new states for messages
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const sendOtp = async () => {
    if (sendingOtp) return;
    setSendingOtp(true);
    setMessage(null);

    try {
      const endpoint =
        mode === "signup" ? "/auth/send-signup-otp" : "/auth/send-otp";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body:
          mode === "signup"
            ? JSON.stringify({ email, name, dateOfBirth: dob })
            : JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
        setMessage("OTP sent successfully!");
        setMessageType("success");
      } else {
        setMessage(data.error || "Failed to send OTP");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Something went wrong while sending OTP.");
      setMessageType("error");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setMessage(null);

    try {
      const endpoint =
        mode === "signup" ? "/auth/verify-signup-otp" : "/auth/verify-login-otp";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: otp, name }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        setMessageType("success");
        onAuthSuccess(data.user);
      } else {
        setMessage(data.error || "Invalid OTP");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Something went wrong while verifying OTP.");
      setMessageType("error");
    }
  };

  return (
    <div className="h-screen p-2 flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col p-6">
        <div className="hidden lg:flex items-center mb-8">
          <img src="/Logo.png" alt="logo" className="h-8 w-8 mr-2" />
          <span className="font-bold text-xl">HD</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="flex lg:hidden justify-center items-center mb-8 gap-2 cursor-pointer">
              <img src="/Logo.png" alt="logo" className="h-6 w-6" />
              <span className="font-bold text-xl">HD</span>
            </div>

            {/* ✅ show messages */}
            {message && (
              <div
                className={`p-3 mb-4 rounded-lg text-sm ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700 "
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {step === "form" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">
                  {mode === "signup" ? "Sign up" : "Sign in"}
                </h1>
                {mode === "signup" && (
                  <>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg cursor-pointer"
                    />
                  </>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <button
                  onClick={sendOtp}
                  disabled={sendingOtp || !email.trim()}
                  className={`w-full py-3 rounded-lg text-white ${
                    sendingOtp
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  }`}
                >
                  {sendingOtp ? "Sending OTP..." : "Get OTP"}
                </button>
                <p className="text-sm text-center">
                  {mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        className="text-blue-500 cursor-pointer"
                        onClick={() => setMode("login")}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Need an account?{" "}
                      <button
                        className="text-blue-500 cursor-pointer"
                        onClick={() => setMode("signup")}
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Enter OTP</h1>
                <div className="relative">
                  <input
                    type={showOtp ? "text" : "password"}
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  onClick={verifyOtp}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                  Verify & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1">
        <img
          src="/BackgroundImg.jpg"
          alt="side"
          className="w-full h-full object-cover rounded-l-2xl"
        />
      </div>
    </div>
  );
};

export default Auth;
