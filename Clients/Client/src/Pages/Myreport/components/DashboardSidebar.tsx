import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export type DashboardNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

type DashboardSidebarProps = {
  items: DashboardNavItem[];
};

const DashboardSidebar = memo(({ items }: DashboardSidebarProps) => {
  return (
    <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4">
        <div className="px-2 py-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Doctor panel
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">
            Dashboard
          </h1>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-teal-50 text-teal-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <item.icon className="h-5 w-5" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
});

DashboardSidebar.displayName = "DashboardSidebar";

export default DashboardSidebar;
