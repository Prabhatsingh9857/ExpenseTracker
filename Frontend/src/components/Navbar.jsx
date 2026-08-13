
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ======================================================
  // USER INFORMATION
  // ======================================================

  const userName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "User";

  const userEmail =
    user?.email ||
    "user@example.com";

  // ======================================================
  // INITIALS
  // ======================================================

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(userName);

  // ======================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ======================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    setIsOpen(false);

    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login");
  };

  // ======================================================
  // NAVBAR
  // ======================================================

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            LOGO SECTION
        ================================================== */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 min-w-0"
        >
          {/* LOGO */}

          <div className="w-18 h-18 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/logoo.png"
              alt="Expense Tracker"
              className="w-full h-full object-contain"
              onError={(event) => {
                console.error(
                  "Logo could not be loaded:",
                  event
                );
              }}
            />
          </div>

          {/* LOGO TEXT */}

          <div className="hidden sm:block text-left">
            <h1 className="text-lg font-bold text-gray-800 leading-tight">
              Expense Tracker
            </h1>

            <p className="text-[11px] text-gray-500 leading-tight">
              Manage your finances
            </p>
          </div>
        </button>

        {/* ==================================================
            USER SECTION
        ================================================== */}

        <div
          className="relative shrink-0"
          ref={dropdownRef}
        >
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              flex
              items-center
              gap-3
              px-2
              py-1.5
              rounded-lg
              hover:bg-gray-50
              transition-colors
              focus:outline-none
            "
          >
            {/* AVATAR */}

            <div className="relative shrink-0">
              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-teal-600
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-sm
                "
              >
                {initials}
              </div>

              {/* ONLINE INDICATOR */}

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  w-2.5
                  h-2.5
                  bg-green-500
                  border-2
                  border-white
                  rounded-full
                "
              />
            </div>

            {/* USER DETAILS */}

            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate max-w-36">
                {userName}
              </p>

              <p className="text-xs text-gray-500 truncate max-w-36">
                {userEmail}
              </p>
            </div>

            {/* DROPDOWN ARROW */}

            <ChevronDown
              className={`
                w-4
                h-4
                text-gray-500
                shrink-0
                transition-transform
                duration-200
                ${isOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* ==================================================
              DROPDOWN
          ================================================== */}

          {isOpen && (
            <div
              className="
                absolute
                top-full
                right-0
                mt-2
                w-64
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-xl
                overflow-hidden
              "
            >
              {/* USER HEADER */}

              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-teal-600
                      flex
                      items-center
                      justify-center
                      text-white
                      font-bold
                      shrink-0
                    "
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {userName}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* MENU */}

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    rounded-lg
                    hover:bg-gray-50
                    transition-colors
                  "
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/settings");
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-sm
                    text-gray-700
                    rounded-lg
                    hover:bg-gray-50
                    transition-colors
                  "
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </button>
              </div>

              {/* LOGOUT */}

              <div className="border-t border-gray-100 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-sm
                    text-red-600
                    rounded-lg
                    hover:bg-red-50
                    transition-colors
                  "
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

