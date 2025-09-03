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

  const [sendingOtp, setSendingOtp] = useState(false); // <--- new state

  const sendOtp = async () => {
    if (sendingOtp) return; 
    setSendingOtp(true);

    try {
      if (mode === "signup") {
        await fetch(`${API_BASE}/auth/send-signup-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, name, dateOfBirth: dob }),
        });
      } else {
        await fetch(`${API_BASE}/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        });
      }
      setStep("otp");
    } catch (err) {
      console.error("Failed to send OTP", err);
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const endpoint =
      mode === "signup" ? "/auth/verify-signup-otp" : "/auth/verify-login-otp";

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code: otp,name }),
    });

    const data = await res.json();
    if (res.ok) {
      onAuthSuccess(data.user);
    }
  };

  return (
    <div className="h-screen p-2 flex flex-col lg:flex-row">
     
      <div className="flex-1 flex flex-col p-6">
        
        <div className="hidden lg:flex items-center mb-8">
          
          <img src='/Logo.png' alt="logo" className="h-8 w-8 mr-2" />
          <span className="font-bold text-xl">HD</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            
            <div className="flex lg:hidden justify-center items-center mb-8 gap-2 cursor-pointer">
              <img src='/Logo.png' alt="logo" className="h-6 w-6" />
              <span className="font-bold text-xl">HD</span>
            </div>

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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
          src='/BackgroundImg.jpg'
          alt="side"
          className="w-full h-full object-cover rounded-l-2xl"
        />
      </div>
      
    </div>
  );
};

export default Auth;
