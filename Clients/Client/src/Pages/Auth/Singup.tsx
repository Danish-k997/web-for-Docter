import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getRequestErrorMessage,
  registerUser,
} from "../../Serveces/apiservices";
import dotcer from "../../assets/dot.png";
import { UseAppDispatch } from "../../Serveces/Hook"; // ✅ Redux Hook
import { setPendingVerification } from "../../redux/authSlice"; //
import { toast } from "react-toastify";

type FieldErrors = Partial<Record<"username" | "email" | "password", string>>;

function validateForm(values: {
  username: string;
  email: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const u = values.username.trim();
  if (u.length < 2) errors.username = "Enter at least 2 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters";
  }
  return errors;
}

const Singup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const navigate = useNavigate();
const dispatch = UseAppDispatch(); 
  const inputClass = useMemo(
    () =>
      "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-shadow focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15 disabled:opacity-60",
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerError(null);
    setSuccessMessage(null);

    const nextErrors = validateForm({ username, email, password });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const data = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });
     

      const userId = data.user.userId;
      
      if (!userId) {
        toast.error("Session expired. Please register again.");
        navigate("/signup");
        return; // Function yahan ruk jayega
      }
      dispatch(setPendingVerification({ userId: userId }));
      setSuccessMessage(data.message);
      toast.success(data.message || "Registered successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setFieldErrors({});
      console.log(userId);
      navigate("/verify-otp");
    } catch (err) {
      setBannerError(getRequestErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white font-['DM_Sans',system-ui,sans-serif] text-gray-900 antialiased">
      <header className="border-b border-emerald-100/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-900 text-white shadow-sm"
            aria-hidden
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4v16M8 8h8M8 16h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-900 sm:text-xs">
            Dr. Ayushi Sinha
            <span className="mx-2 text-teal-600/70">|</span>
            Clinical Excellence
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="overflow-hidden rounded-2xl border border-emerald-100/80 bg-white shadow-[0_24px_70px_-24px_rgba(0,77,64,0.35)]">
          <div className="grid lg:grid-cols-2">
            <div className="relative order-1 min-h-[240px] bg-emerald-100/40 lg:order-none lg:min-h-[min(640px,80vh)]">
              <img
                src={dotcer}
                alt="Dr. Ayushi Sinha — clinical care"
                className="absolute inset-0 h-full w-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-teal-950/50 via-teal-950/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-teal-950/10 lg:to-teal-950/35"
                aria-hidden
              />
            </div>

            <div className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Start Your Wellness Journey — Create Your Account
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Join Dr. Ayushi Sinha&apos;s clinic for expert medical care.
              </p>

              {bannerError && (
                <div
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  {bannerError}
                </div>
              )}
              {successMessage && (
                <div
                  className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                  role="status"
                >
                  {successMessage}
                </div>
              )}

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <label htmlFor="signup-username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="signup-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username)
                        setFieldErrors((p) => ({ ...p, username: undefined }));
                    }}
                    className={inputClass}
                    aria-invalid={Boolean(fieldErrors.username)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.username && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email)
                        setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    className={inputClass}
                    aria-invalid={Boolean(fieldErrors.email)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password)
                          setFieldErrors((p) => ({
                            ...p,
                            password: undefined,
                          }));
                      }}
                      className={`${inputClass} pr-12`}
                      aria-invalid={Boolean(fieldErrors.password)}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-full bg-[#004d40] py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-teal-800 underline-offset-2 hover:text-teal-950 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Singup;
