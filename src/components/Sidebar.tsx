import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, List, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-screen w-55 bg-white border-r border-[hsl(var(--border))] transition-transform duration-300 ease-in-out transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[hsl(var(--border))]">
          <h1 className="text-xl font-bold text-[hsl(var(--primary))]">
            Agent Manager
          </h1>
          <button
            className="icon-button lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `
              flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-[hsl(var(--primary))/10] text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
              }
            `}
            onClick={() => isOpen && toggleSidebar()}
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="/agents"
            className={({ isActive }) => `
              flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-[hsl(var(--primary))/10] text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
              }
            `}
            onClick={() => isOpen && toggleSidebar()}
          >
            <Users size={18} className="mr-2" />
            Agents
          </NavLink>

          <NavLink
            to="/lists"
            className={({ isActive }) => `
              flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-[hsl(var(--primary))/10] text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
              }
            `}
            onClick={() => isOpen && toggleSidebar()}
          >
            <List size={18} className="mr-2" />
            Lists
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
