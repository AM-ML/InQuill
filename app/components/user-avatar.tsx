"use client";

import { useState } from "react";
import { useAuth } from "../lib/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";

const DEFAULT_AVATAR_URL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpapirus-team%2Fpapirus-status%2F128%2Favatar-default-icon.png&f=1&nofb=1&ipt=7d64dc7f75f630f5a2c012812ed8ebb73f1625630d69614d2665bc70c0641e73";

export function UserAvatar({ mob = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeDropdown();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeDropdown();
  };

  if (!user) {
    return (
      <Link to="/auth" className="flex items-center">
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Login
        </button>
      </Link>
    );
  }

  return (
    <DropdownMenu className="relative">
      <DropdownMenuTrigger className="focus:outline-none">
        <div
          className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          onClick={toggleDropdown}
        >
          <img
            src={user.avatar || DEFAULT_AVATAR_URL}
            alt={`${user.username}'s avatar`}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_AVATAR_URL;
            }}
          />
        </div>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleNavigation("/dashboard/profile")}
          >
            <div className="flex w-full cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleNavigation("/dashboard/settings")}
          >
            <div className="flex w-full cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

