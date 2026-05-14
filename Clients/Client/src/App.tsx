import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Customers/Home.tsx";
import "./App.css";
import Navbar from "./Components/SharedCompo/Navbar.tsx";
import Singup from "./Pages/Auth/Singup.tsx";
import Otpverifay from "./Pages/Auth/Otpverifay.tsx";
import Login from "./Pages/Auth/Login.tsx";

function App() {
  const { pathname } = useLocation();
  const hideNavbar =
    pathname === "/signup" || pathname === "/login" || pathname === "/verify-otp";

  return (
    <div className="relative min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<Otpverifay />} />
        </Routes>

      </main>
      {/* Footer yahan aayega */}
    </div>
  );
}

export default App;
