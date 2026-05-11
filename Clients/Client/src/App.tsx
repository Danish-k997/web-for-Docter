import { Link, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Customers/Home.tsx";
import "./App.css";
import Navbar from "./Components/SharedCompo/Navbar.tsx";
import Singup from "./Pages/Auth/Singup.tsx";

function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/singup" || pathname === "/login";

  return (
    <div className="relative min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Singup />} />
          <Route
            path="/login"
            element={
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 font-['DM_Sans',system-ui,sans-serif] text-gray-700">
                <p className="text-center text-sm">Login page is not built yet.</p>
                <Link
                  to="/singup"
                  className="text-sm font-semibold text-teal-800 underline-offset-2 hover:underline"
                >
                  Back to sign up
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      {/* Footer yahan aayega */}
    </div>
  );
}

export default App;
