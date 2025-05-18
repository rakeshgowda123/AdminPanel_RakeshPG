import React from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  return (
    <header className="w-[90%] ml-auto bg-white border-b border-[hsl(var(--border))] py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="icon-button lg:hidden mr-2"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">Agent List Manager</h1>
        </div>

        <div className="relative">
          <button
            className="flex items-center space-x-2 text-sm font-medium rounded-full py-2 px-3 hover:bg-[hsl(var(--muted))] transition-colors"
            onClick={toggleUserMenu}
          >
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="hidden sm:block">{user?.name || "Admin"}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                userMenuOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <div className="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))]">
                  Signed in as
                  <br />
                  <span className="font-medium text-[hsl(var(--foreground))]">
                    {user?.email}
                  </span>
                </div>

                <div className="separator"></div>

                <button
                  onClick={logout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  role="menuitem"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
