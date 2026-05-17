// src/Serveces/useAuth.ts
import { UseAppSelector, UseAppDispatch } from "./Hook";
import { logout as logoutAction } from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = UseAppDispatch();
  const authState = UseAppSelector((state) => state.auth);

  // User object se role nikalna safely
  const role = authState.user?.role || null;
  const isAdmin = role === "admin";
  const isuser = role === "user";

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    // Raw states
    isAuthenticated: authState.isAuthenticated,
    isOtpPending: authState.isOtpPending,
    loading: authState.loading,
    userId: authState.userId, // OTP page ke liye
    user: authState.user,

    // Computed
    role,
    isAdmin,
    isuser,

    // Actions
    logout,
  };
};