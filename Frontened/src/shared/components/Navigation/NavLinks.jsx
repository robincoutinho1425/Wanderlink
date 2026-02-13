import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import authContext from "../../context/auth-context";

const NavLinks = ({ onClearSearch }) => {
  const location = useLocation();
  const auth = useContext(authContext);
  const isForgotPasswordPage = location.pathname === "/user/forgot-password";

  const handleNavClick = () => {
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <nav className="w-full">
      <ul className="flex flex-col md:flex-row items-center justify-center gap-4 p-4">
        {auth.isLoggedIn && (
          <li>
            <NavLink
              to={`/profile/${auth.creatorId}`}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-400 text-gray-900 shadow-md"
                    : "text-gray-700 hover:bg-yellow-100"
                }`
              }
            >
              My Profile
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/places/all"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-yellow-400 text-gray-900 shadow-md"
                  : "text-gray-700 hover:bg-yellow-100"
              }`
            }
          >
            All Places
          </NavLink>
        </li>

        {isForgotPasswordPage ? (
          <>
            <li>
              <NavLink
                to="/auth"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
              >
                Back to Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
              >
                All Users
              </NavLink>
            </li>
            {auth.isLoggedIn && (
              <li>
                <NavLink
                  to="/places/new"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-400 text-gray-900 shadow-md"
                        : "text-gray-700 hover:bg-yellow-100"
                    }`
                  }
                >
                  Add Place
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/about"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
              >
                About
              </NavLink>
            </li>

            {auth.isLoggedIn && (
              <li>
                <button
                  onClick={() => {
                    handleNavClick();
                    auth.logout();
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </li>
            )}
            {!auth.isLoggedIn && (
              <li>
                <NavLink to="/auth" onClick={handleNavClick}>
                  <button className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-200 shadow-sm hover:shadow-md">
                    Login
                  </button>
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavLinks;
