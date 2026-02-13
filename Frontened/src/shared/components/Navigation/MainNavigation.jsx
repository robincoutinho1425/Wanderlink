import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import SearchBar from "../../../places/pages/SearchBar";
import { MapPin, Menu, User, Compass, AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useHttp } from "../../hooks/http-hook";
import authContext from "../../context/auth-context";
import { useContext } from "react";
const MainNavigation = ({ onSearch, onClearSearch }) => {
  const auth = useContext(authContext);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const location = useLocation();
  const { sendRequest } = useHttp();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const openDrawer = () => setDrawerIsOpen(true);
  const closeDrawer = () => setDrawerIsOpen(false);

  // Only show search bar on /places/all route
  const shouldShowSearch = location.pathname === "/places/all";
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!auth.isLoggedIn || !auth.creatorId) return;
    const findTheUser = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/users/${auth.creatorId}`
        );

        setUser(responseData.user);
      } catch (error) {
        setError("Could not fetch user details");
        console.error(error);
      }
    };
    findTheUser();
  }, [sendRequest, auth.creatorId]);

  return (
    <>
      {drawerIsOpen && (
        <SideDrawer closeDrawer={closeDrawer}>
          <nav className="main-navigation__drawer-nav">
            <NavLinks onClearSearch={onClearSearch} />
          </nav>
        </SideDrawer>
      )}
      <MainHeader>
        <button
          className="main-navigation__menu-btn p-2 hover:bg-gray-100 rounded-full"
          onClick={openDrawer}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="main-navigation__title">
          <Link
            to="/"
            onClick={onClearSearch}
            className="flex items-center gap-2 text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            <MapPin className="w-8 h-8 text-rose-500" />
            <span className="flex flex-col items-start">
              <span className="text-sm font-normal text-gray-500">
                Discover
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                YourPlaces
              </span>
            </span>
          </Link>
        </h1>

        {isHomePage && auth.isLoggedIn && (
          <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
            {error ? (
              <div className="flex items-center text-red-500">
                <AlertCircle className="mr-2 w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-rose-500" />
                <span className="text-white font-medium">
                  Welcome, {user.userName}!
                </span>
                <Compass className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-6 h-6 opacity-50" />
                <span>Login Please!!...</span>
              </div>
            )}
          </div>
        )}

        {/* Conditionally render SearchBar only on /places/all */}
        {shouldShowSearch && (
          <div className="mx-4">
            <SearchBar onSearch={onSearch} />
          </div>
        )}

        <nav className="main-navigation__header-nav">
          <NavLinks onClearSearch={onClearSearch} />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
