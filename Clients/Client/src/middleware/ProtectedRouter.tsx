// middleware/ProtectedRouter.tsx
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { UseAppSelector } from "../Serveces/Hook";
import Sppiner from "../Components/SharedCompo/Sppiner";
type ProtectedRouteProps = {
  allowedRoles?: string[]; // Make it optional
};

const ProtectedRouter = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isInitialized } = UseAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Jab tak initial auth check poora nahi hota, loader dikhayein
  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Sppiner label="Loading App..." size="xl" color="#0f766e" fullScreen />
      </div>
    );
  }

  // Agar user logged in nahi hai
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Sab theek hai, component render karein
  return <Outlet />;
};

export default ProtectedRouter;