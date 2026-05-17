import { useState } from "react";
import { Link } from "react-router-dom";
import { UseAppSelector, UseAppDispatch } from "../../Serveces/Hook";
import { logout } from "../../Serveces/apiservices";
import { LogOut } from "lucide-react";
import { setIsAuthenticated, setUser } from "../../redux/authSlice";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = UseAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = UseAppDispatch();

const handleLogout = async () => {
  try {
    await logout();
    // Redux state को clear करो
    dispatch(setIsAuthenticated(false));
    dispatch(setUser(null));
    // Token को remove करो
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    // Login page पर redirect करो
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

  const navlinks = [
    { name: "Home", href: "/" },
    { name: "Expertise", href: "#" },
    { name: "Schedule", href: "#" },
    { name: "Clinic", href: "#" },
    ...(isAuthenticated ? [{ name: "My report", href: "/myreport" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Container: Restricted width for large screens (Standard Practice) */}
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 font-bold text-xl md:text-2xl text-teal-900"
        >
          Dr. Ayushi Sinha
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop Navigation" className="hidden md:block">
          <ul className="flex gap-8 items-center text-gray-700 font-medium">
            {navlinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-teal-600 transition-all duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA (Call to Action) */}
        <div className="hidden md:block">
           {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="block text-center bg-[#004d40] text-white py-2 px-3 rounded-xl font-semibold"
              >
                Logout
                <LogOut className="inline-block ml-2" size={18} />
              </button>
            ) : (
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center bg-[#004d40] text-white py-2 px-3 rounded-xl font-semibold"
              >
                Sign Up
              </Link>
            )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 text-teal-900 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-around">
            {/* Industry style custom animated hamburger (optional) or SVG */}
            <span
              className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-current transition duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu - Absolute positioning (Industry Standard to avoid layout shift) */}
      <div
        className={`absolute top-full left-0 w-full bg-white border-b shadow-xl transition-all duration-300 ease-in-out transform ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"} md:hidden`}
      >
        <ul className="flex flex-col p-6 gap-4 text-gray-700 font-medium">
          {navlinks.map((link) => (
            <li key={link.name} className="border-b border-gray-50 pb-2">
              <a
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg"
              >
                {link.name}
              </a>
            </li>
          ))}
          <li className="pt-2">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="block text-center bg-[#004d40] text-white py-2 px-3 rounded-xl font-semibold"
              >
                Logout
                <LogOut className="inline-block ml-2" size={18} />
              </button>
            ) : (
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center bg-[#004d40] text-white py-3 rounded-xl font-semibold"
              >
                Sign Up
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
