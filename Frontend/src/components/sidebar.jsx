import React from "react";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  User,
  CircleHelp,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({
  user = {},
  isCollapsed = false,
  setIsCollapsed = () => {},
  onLogout = () => {},
}) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Income",
      path: "/income",
      icon: ArrowUpCircle,
    },
    {
      name: "Expenses",
      path: "/expense", // IMPORTANT: singular
      icon: ArrowDownCircle,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const userName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "User";

  const userEmail =
    user?.email ||
    user?.gmail ||
    "user@gmail.com";

  const avatarLetter =
    userName.charAt(0).toUpperCase() || "U";

  return (
    <aside
      className={`
        hidden
        lg:flex
        flex-col
        fixed
       top-16
        bottom-0
        left-0
        z-30
        transition-all
        duration-300
        ${isCollapsed ? "w-20" : "w-60"}
      `}
    >
      <div className="flex h-full flex-col border-r border-gray-200 bg-white shadow-sm">

        {/* USER PROFILE */}
        <div
          className={`
            relative
            flex
            items-center
            border-b
            border-gray-200
            h-20
            ${
              isCollapsed
                ? "justify-center px-2"
                : "px-5"
            }
          `}
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
               bg-cyan-500
              from-cyan-500
              to-teal-600
              text-lg
              font-semibold
              text-white
            "
          >
            {avatarLetter}
          </div>

          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="max-w-36 truncate text-sm font-semibold text-gray-800">
                {userName}
              </p>

              <p className="max-w-36 truncate text-xs text-gray-500">
                {userEmail}
              </p>
            </div>
          )}

          {/* COLLAPSE */}
          <button
            type="button"
            onClick={() =>
              setIsCollapsed((previous) => !previous)
            }
            className="
              absolute
              -right-3
              top-1/2
              z-40
              flex
              h-6
              w-6
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-gray-300
              bg-white
              text-gray-500
              shadow-sm
              transition
              hover:border-teal-400
              hover:bg-teal-50
              hover:text-teal-600
            "
            title={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `
                  mb-1
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-cyan-50 text-teal-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }

                  ${
                    isCollapsed
                      ? "justify-center px-2"
                      : ""
                  }
                  `
                }
                title={
                  isCollapsed
                    ? item.name
                    : undefined
                }
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!isCollapsed && (
                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM MENU */}
        <div className="border-t border-gray-200 px-2 py-3">

          {/* SUPPORT */}
          <button
            type="button"
            className={`
              mb-1
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-sm
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
              hover:text-gray-900

              ${
                isCollapsed
                  ? "justify-center px-2"
                  : ""
              }
            `}
            title={
              isCollapsed
                ? "Support"
                : undefined
            }
          >
            <CircleHelp className="h-5 w-5 shrink-0" />

            {!isCollapsed && (
              <span>Support</span>
            )}
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={onLogout}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-sm
              font-medium
              text-gray-600
              transition
              hover:bg-red-50
              hover:text-red-600

              ${
                isCollapsed
                  ? "justify-center px-2"
                  : ""
              }
            `}
            title={
              isCollapsed
                ? "Logout"
                : undefined
            }
          >
            <LogOut className="h-5 w-5 shrink-0" />

            {!isCollapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;