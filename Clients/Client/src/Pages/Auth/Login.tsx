import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getRequestErrorMessage, loginUser } from "../../Serveces/apiservices";
import { setAccessToken } from "../../AxioseApis/api";
import { toast } from "react-toastify";
import { UseAppDispatch } from "../../Serveces/Hook";
import { setCredentials } from "../../redux/authSlice";

type FieldErrors = Partial<Record<"email" | "password", string>>;

function validateForm(values: {
  email: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (values.password.length < 1) {
    errors.password = "Password is required";
  }
  return errors;
}

function ClinicHeader() {
  return (
    <header className="border-b border-emerald-100/80 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#004d40] text-white shadow-sm"
          aria-hidden
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3v18M6 9h12M6 15h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 5c1.5 1.5 2 3.5 1.5 5.5"
              stroke="#a7f3d0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-[#004d40] sm:text-base">
            DR. AYUSHI SINHA
            <span className="mx-2 font-normal text-teal-600/80">|</span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-sm">
              Clinical Excellence
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}

function LoginIllustration() {
  return (
    <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center bg-[#e0f2f1] px-8 py-14 lg:min-h-0">
      <div
        className="relative flex h-56 w-56 items-center justify-center text-[#004d40] sm:h-64 sm:w-64"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
          <circle cx="100" cy="100" r="78" fill="rgb(255 255 255 / 0.35)" />
          <path
            d="M100 36c-8 18-28 32-48 36 4 22 18 42 36 52 18-10 32-30 36-52-20-4-40-18-48-36z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M52 118c28 8 68 8 96 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M100 52v48M76 76h48"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M148 62c6 10 10 22 10 36"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="mt-4 max-w-xs text-center text-sm font-medium text-[#004d40]/80">
        Trusted care for you and your family
      </p>
    </div>
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = UseAppDispatch();
  const inputClass = useMemo(
    () =>
      "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-shadow focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/15 disabled:opacity-60",
    [],
  );

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBannerError(null);

    const nextErrors = validateForm({ email, password });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const data = await loginUser({ email: email.trim(), password });

      setAccessToken(data.accessToken);
      if (!data.success) {
        return toast.error(data.message || "Login failed");
      }

      toast.success(data.message || "Login successful");
      dispatch(setCredentials({ 
  user: { role: data.data?.role || "user" } 
}));
      const redirectPath = data.data?.role === "user" ? "/" : "/dashboard";
      navigate(redirectPath);
    } catch (err) {
      const msg = getRequestErrorMessage(err);
      setBannerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f2f1] font-sans text-gray-900 antialiased">
      <ClinicHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="overflow-hidden rounded-2xl border border-emerald-100/80 bg-white shadow-[0_24px_70px_-24px_rgba(0,77,64,0.35)]">
          <div className="grid lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <LoginIllustration />
            </div>

            <div className="order-1 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:order-2 lg:px-12 lg:py-14">
              <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100/90 bg-white/95 p-6 shadow-sm sm:p-8">
                <h1 className="text-2xl font-bold leading-tight text-[#004d40] sm:text-3xl">
                  Welcome Back!
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                  Login to access your appointments and medical records.
                </p>

                {bannerError && (
                  <div
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    role="alert"
                  >
                    {bannerError}
                  </div>
                )}

                <form
                  className="mt-8 space-y-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label htmlFor="login-email" className={labelClass}>
                        Email Address
                      </label>
                    </div>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
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
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <label
                        htmlFor="login-password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="shrink-0 text-sm font-semibold text-[#004d40] underline-offset-2 hover:text-teal-900 hover:underline"
                        onClick={() =>
                          toast.info("Password reset will be available soon.")
                        }
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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

                  <div className="flex items-center gap-3">
                    <input
                      id="login-remember"
                      name="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#004d40] focus:ring-[#004d40]/30"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="login-remember"
                      className="text-sm text-gray-700 select-none"
                    >
                      Remember Me
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-full bg-[#004d40] py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004d40] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isSubmitting ? "Signing in…" : "Login"}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-[#004d40] underline-offset-2 hover:text-teal-900 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
