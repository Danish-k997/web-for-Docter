import { useState } from "react";
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Link as ScrollLink, scroller } from "react-scroll";
import { UseAppSelector, UseAppDispatch } from "../../Serveces/Hook";
import { logoutuser } from "../../Serveces/apiservices";
import { LogOut } from "lucide-react";
import { logout } from "../../redux/authSlice";
import {
  HOME_SECTIONS,
  NAVBAR_SCROLL_OFFSET,
  SCROLL_DURATION,
  SCROLL_SMOOTH_EASING,
  SCROLL_SPY_THROTTLE,
  type HomeSectionName,
} from "../../config/navigation";

type RouteNavItem = {
  name: string;
  href: string;
  type: "route";
};

type SectionNavItem = {
  name: string;
  target: HomeSectionName;
  type: "section";
};

type NavItem = RouteNavItem | SectionNavItem;

const baseNavLinkClass =
  "cursor-pointer transition-all duration-300 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-4";
const activeNavLinkClass = "text-teal-700";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<HomeSectionName | null>(
    null,
  );
  const { isAuthenticated, user } = UseAppSelector((state) => state.auth);
  const dispatch = UseAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logoutuser();

      dispatch(logout());

      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navlinks: NavItem[] = [
    { name: "Home", href: "/", type: "route" },
    { name: "Expertise", target: HOME_SECTIONS.expertise, type: "section" },
    { name: "Schedule", target: HOME_SECTIONS.schedule, type: "section" },
    ...(user?.role === "admin"
      ? ([{ name: "Dashboard", href: "/dashboard", type: "route" }] as const)
      : ([{ name: "Clinic", href: "/", type: "route" }] as const)),
    ...(isAuthenticated
      ? ([{ name: "My report", href: "/myreport", type: "route" }] as const)
      : []),
  ];

  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleRouteNavigation = () => {
    setActiveSection(null);
    closeMobileMenu();
  };

  const handleSectionRouteNavigation = (target: HomeSectionName) => {
    setActiveSection(target);
    closeMobileMenu();
    navigate("/", { state: { scrollTo: target } });
  };

  const scrollToSection = (target: HomeSectionName) => {
    setActiveSection(target);
    closeMobileMenu();
    window.requestAnimationFrame(() => {
      scroller.scrollTo(target, {
        smooth: SCROLL_SMOOTH_EASING,
        duration: SCROLL_DURATION,
        offset: NAVBAR_SCROLL_OFFSET,
      });
    });
  };

  const handleSetActiveSection = (target: string) => {
    if (target === HOME_SECTIONS.expertise || target === HOME_SECTIONS.schedule) {
      setActiveSection(target);
    }
  };

  const renderNavItem = (link: NavItem, mobile = false) => {
    const className = mobile
      ? `${baseNavLinkClass} block text-lg`
      : baseNavLinkClass;
    const mobileTabIndex = mobile && !isMenuOpen ? -1 : undefined;

    if (link.type === "route") {
      return (
        <RouterNavLink
          to={link.href}
          onClick={handleRouteNavigation}
          tabIndex={mobileTabIndex}
          className={({ isActive }) =>
            `${className} ${isActive && link.href !== "/" ? activeNavLinkClass : ""}`
          }
        >
          {link.name}
        </RouterNavLink>
      );
    }

    if (!isHomePage) {
      return (
        <button
          type="button"
          onClick={() => handleSectionRouteNavigation(link.target)}
          tabIndex={mobileTabIndex}
          className={`${className} text-left`}
        >
          {link.name}
        </button>
      );
    }

    if (mobile) {
      return (
        <button
          type="button"
          onClick={() => scrollToSection(link.target)}
          tabIndex={mobileTabIndex}
          className={`${className} text-left ${
            activeSection === link.target ? activeNavLinkClass : ""
          }`}
        >
          {link.name}
        </button>
      );
    }

    return (
      <ScrollLink
        to={link.target}
        smooth={SCROLL_SMOOTH_EASING}
        duration={SCROLL_DURATION}
        offset={NAVBAR_SCROLL_OFFSET}
        spy
        isDynamic
        spyThrottle={SCROLL_SPY_THROTTLE}
        onClick={() => {
          setActiveSection(link.target);
          closeMobileMenu();
        }}
        onSetActive={handleSetActiveSection}
        className={`${className} ${
          activeSection === link.target ? activeNavLinkClass : ""
        }`}
        role="link"
        tabIndex={mobileTabIndex ?? 0}
      >
        {link.name}
      </ScrollLink>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Container: Restricted width for large screens (Standard Practice) */}
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-12">
        {/* Logo */}
        <RouterLink
          to="/"
          className="shrink-0 font-bold text-xl md:text-2xl text-teal-900"
        >
          Dr. Ayushi Sinha
        </RouterLink>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop Navigation" className="hidden md:block">
          <ul className="flex gap-8 items-center text-gray-700 font-medium">
            {navlinks.map((link) => (
              <li key={link.name}>
                {renderNavItem(link)}
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
            <RouterLink
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center bg-[#004d40] text-white py-2 px-3 rounded-xl font-semibold"
            >
              Sign Up
            </RouterLink>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 text-teal-900 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
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
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        className={`absolute top-full left-0 w-full bg-white border-b shadow-xl transition-all duration-300 ease-in-out transform ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"} md:hidden`}
      >
        <ul className="flex flex-col p-6 gap-4 text-gray-700 font-medium">
          {navlinks.map((link) => (
            <li key={link.name} className="border-b border-gray-50 pb-2">
              {renderNavItem(link, true)}
            </li>
          ))}
          <li className="pt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                tabIndex={!isMenuOpen ? -1 : undefined}
                className="block text-center bg-[#004d40] text-white py-2 px-3 rounded-xl font-semibold"
              >
                Logout
                <LogOut className="inline-block ml-2" size={18} />
              </button>
            ) : (
              <RouterLink
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                tabIndex={!isMenuOpen ? -1 : undefined}
                className="block text-center bg-[#004d40] text-white py-3 rounded-xl font-semibold"
              >
                Sign Up
              </RouterLink>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
