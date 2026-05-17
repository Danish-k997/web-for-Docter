import { Route, Routes, useLocation } from "react-router-dom";
import { checkAuthSession } from "./redux/authSlice.ts";
import { useEffect } from "react";
import { UseAppDispatch, UseAppSelector } from "./Serveces/Hook.ts";
import ProtectedRouter from "./middleware/ProtectedRouter.tsx";
import Home from "./Pages/Customers/Home.tsx";
import "./App.css";
import Navbar from "./Components/SharedCompo/Navbar.tsx";
import Singup from "./Pages/Auth/Singup.tsx";
import Otpverifay from "./Pages/Auth/Otpverifay.tsx";
import Login from "./Pages/Auth/Login.tsx";
import Myreport from "./Pages/Myreport/Myreport.tsx";
import Addreport from "./Pages/Myreport/Addreport.tsx";
import Sppiner from "./Components/SharedCompo/Sppiner.tsx";

function App() {
  const { pathname } = useLocation();
  const dispatch = UseAppDispatch();
  const hideNavbar =
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/verify-otp";

  const { isInitialized } = UseAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sppiner label=" Starting Application..." size="xl" color="#0f766e" fullScreen />
      </div>
    );
  }
  return (
    <div className="relative min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<Otpverifay />} />
          <Route element={<ProtectedRouter allowedRoles={["user", "admin"]} />}>
            <Route path="/myreport" element={<Myreport />} />
            <Route path="/myreport/add" element={<Addreport />} />
          </Route>
        </Routes>
      </main>
      {/* Footer yahan aayega */}
    </div>
  );
}

export default App;
