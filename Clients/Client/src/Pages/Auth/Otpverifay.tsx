import  { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent, ClipboardEvent, FC } from 'react';
import type {  VerifyOtpResponse,VerifyOtpRequest} from "../../Utlis/Types"
import {verifiyotp, getRequestErrorMessage} from "../../Serveces/apiservices"
import { toast } from "react-toastify";
import {UseAppSelector} from "../../Serveces/Hook"

interface OTPProps {
  email?: string;
  length?: number;
  onComplete?: (code: string) => void;
}


const OTPVerification: FC<OTPProps> = ({ 
  email = "j...n@example.com", 
  length = 6,
  onComplete 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [timer, setTimer] = useState<number>(119); 
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  const userId = UseAppSelector(
    (state) => state.auth.userId
  )

  // Ref Array for DOM nodes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const char = value.substring(value.length - 1);

    if (!/^\d*$/.test(char)) return; 

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(v => v !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    
    if (data.length === length && /^\d+$/.test(data)) {
      const pasteData = data.split("");
      setOtp(pasteData);
      inputRefs.current[length - 1]?.focus();
    }
  };
  
  const handlesubmit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== length) return;

    if (!userId) {
      toast.error("user not found");
    }

    if (!/^\d+$/.test(fullOtp)) {
      toast.error("OTP must contain only numbers.");
      return;
    }

    setIsVerifying(true);
    try {
      const playlod:VerifyOtpRequest = {
        userId:userId,
        otp:fullOtp,
      };

      const res: VerifyOtpResponse = await verifiyotp(playlod);

      if (res.success) {
        toast.success("user verfified successfully");
      }
    } catch (error) {
      toast.error("error.message");
      getRequestErrorMessage(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00695C] rounded-lg flex items-center justify-center">
             <span className="text-white text-xl font-bold">✚</span>
          </div>
          <div>
            <h1 className="text-[#004D40] font-extrabold text-lg leading-none">DR. AYUSHI SINHA</h1>
            <p className="text-[#4DB6AC] text-[10px] uppercase font-bold tracking-widest">Clinical Excellence</p>
          </div>
        </div>

        <div className="p-10 text-center" onPaste={handlePaste}>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Verify Your Email</h2>
          <p className="text-gray-500 text-sm mb-10">
            Enter the {length}-digit code sent to <br/>
            <span className="font-bold text-gray-700">{email}</span>.
          </p>

          <div className="flex justify-between gap-3 mb-10">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                // FIXED REF LOGIC: Explicitly using curly braces to return void
                ref={(el) => { inputRefs.current[idx] = el; }}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-full h-16 border-2 border-gray-100 rounded-xl text-center text-2xl font-black text-[#00695C] focus:border-[#5E9188] focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
              />
            ))}
          </div>

          <button 
            disabled={otp.some(d => d === "")}
            onSubmit={handlesubmit}
            className="w-full bg-[#5E9188] hover:bg-[#4a756e] disabled:bg-gray-300 text-white font-black py-4 rounded-xl transition-all shadow-lg"
          > 
           {isVerifying ? "Verifing": "Verify OTP"}
          </button>

          <div className="mt-8">
            <button disabled={timer > 0} className="text-[#00695C] font-black text-sm disabled:text-gray-400">
              Resend OTP
            </button>
            <p className="text-gray-400 text-xs font-bold uppercase mt-2">
              Resend in <span className="text-gray-700">{formatTime(timer)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;