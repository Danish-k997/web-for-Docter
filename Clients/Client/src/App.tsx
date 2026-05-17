import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Customers/Home.tsx";
import "./App.css";
import Navbar from "./Components/SharedCompo/Navbar.tsx";
import Singup from "./Pages/Auth/Singup.tsx";
import Otpverifay from "./Pages/Auth/Otpverifay.tsx";
import Login from "./Pages/Auth/Login.tsx";
import Myreport from "./Pages/Myreport/Myreport.tsx";
import { useEffect } from "react";
import  api  from "./AxioseApis/api.ts";
import { UseAppDispatch } from "./Serveces/Hook.ts";
import { setIsAuthenticated, setUser } from "./redux/authSlice.ts";


function App() {
  const { pathname } = useLocation();
  const dispatch = UseAppDispatch();
  const hideNavbar =
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/verify-otp";
  useEffect(() => {
    const authPages = ["/login", "/signup", "/verify-otp"];
  if (authPages.includes(pathname)) return;
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/getme");

        if (response.data.authenticated) {
          dispatch(setIsAuthenticated(true));
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        dispatch(setIsAuthenticated(false));
      }
    };

    checkAuth();
  }, [dispatch, pathname]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<Otpverifay />} />
          <Route path="/myreport" element={<Myreport />} />
        </Routes>
      </main>
      {/* Footer yahan aayega */}
    </div>
  );
}

export default App;
