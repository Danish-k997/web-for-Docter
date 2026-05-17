import { useState, useEffect, useRef, useCallback } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom"; // Industry standard navigation
import { verifiyotp, getRequestErrorMessage } from "../../Serveces/apiservices";
import { toast } from "react-toastify";
import { UseAppDispatch } from "../../Serveces/Hook";
import { setCredentials } from "../../redux/authSlice";
import { useAuth } from "../../Serveces/Auth";

import { setAccessToken } from "../../AxioseApis/api";

interface OTPProps {
  email?: string;
  length?: number;
}

const OTPVerification: FC<OTPProps> = ({ email = "User", length = 6 }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [timer, setTimer] = useState<number>(119);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = UseAppDispatch();
  const { userId } = useAuth();

  const handleRef = (el: HTMLInputElement | null, index: number): void => {
    inputRefs.current[index] = el;
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerify = useCallback(async () => {
    const fullOtp = otp.join("");

    // 1. Logic Guard
    if (fullOtp.length !== length) {
      toast.warn(`Please enter all ${length} digits`);
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please register again.");
      navigate("/signup");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verifiyotp({ userId, otp: fullOtp });
      console.log("log access token", response);

      setAccessToken(response.accessToken);
      if (!response.success) {
        return;
      }

      const role = response.data?.role || "user";

      toast.success("Account verified successfully!");

      dispatch(
        setCredentials({
          user: { role: role },
        }),
      );
      const redirectPath = role === "user" ? "/" : "/dashboard";

      navigate(redirectPath);
    } catch (error) {
      const msg = getRequestErrorMessage(error);
      toast.error(msg || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  }, [otp, userId, length, navigate, dispatch]);

  // Handle Input Changes
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header - Clinic Branding */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 bg-[#00695C] rounded-lg flex items-center justify-center text-white font-bold">
            ✚
          </div>
          <div>
            <h1 className="text-[#004D40] font-black text-lg">
              DR. AYUSHI SINHA
            </h1>
            <p className="text-[#4DB6AC] text-[10px] tracking-widest font-bold uppercase">
              Clinical Excellence
            </p>
          </div>
        </div>

        <div className="p-10 text-center">
          <h2 className="text-2xl font-black text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Verification code sent to{" "}
            <span className="text-gray-900 font-bold">{email}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  handleRef(el, idx);
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                    inputRefs.current[idx - 1]?.focus();
                  }
                }}
                className="w-full h-14 border-2 border-gray-100 rounded-xl text-center text-xl font-black text-[#00695C] focus:border-[#5E9188] focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
              />
            ))}
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.some((d) => !d)}
            className="w-full bg-[#5E9188] hover:bg-[#4a756e] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {isVerifying ? "Verifying..." : "Verify Account"}
          </button>

          {/* Resend Logic */}
          <div className="mt-8">
            <button
              disabled={timer > 0}
              className="text-[#00695C] font-black text-sm disabled:text-gray-300 transition-colors"
            >
              Resend Code
            </button>
            {timer > 0 && (
              <p className="text-gray-400 text-[10px] font-bold uppercase mt-2">
                Available in{" "}
                <span className="text-gray-600">{formatTime(timer)}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
