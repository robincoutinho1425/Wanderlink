import { useCallback, useState, useEffect, Suspense } from "react";
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./user/pages/UserProfile";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AllPlaces from "./places/pages/AllPlaces";
import authContext from "./shared/context/auth-context";
import UpdateProfile from "./user/pages/UpdateProfile";
import { Navigate } from "react-router-dom";
import { useHttp } from "./shared/hooks/http-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
function App() {
  const Users = React.lazy(() => import("./user/pages/Users"));
  const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
  const UsersPlaces = React.lazy(() => import("./places//pages/UsersPlaces"));
  const ForgotPassword = React.lazy(() =>
    import("./user/pages/ForgotPassword")
  );
  const ResetPassword = React.lazy(() => import("./user/pages/ResetPassword"));
  const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
  const Authenticate = React.lazy(() => import("./user/pages/Authenticate"));
  const AboutPage = React.lazy(() => import("./user/pages/AboutPage"));

  const [userId, setUserId] = useState(null);
  const { sendRequest } = useHttp();
  const [token, setToken] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const login = useCallback((userid, token) => {
    setToken(token);
    setUserId(userid);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userid: userid,
        token: token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userid, storedData.token);
    } else {
      setToken(null);
      setUserId(null);
    }
  }, [login]);

  const handleSearch = async (searchType, searchQuery) => {
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_BACKENED_URL
        }/places/search?type=${searchType}&query=${searchQuery}`
      );

      // Add explicit validation of the response
      if (responseData && Array.isArray(responseData.places)) {
        setSearchResults(responseData.places);
      } else {
        console.warn("Invalid search response format:", responseData);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };
  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
  }, []);
  return (
    <authContext.Provider
      value={{
        isLoggedIn: !!token,
        creatorId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation
          onSearch={handleSearch}
          onClearSearch={clearSearchResults}
        />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <Users
                    searchResults={searchResults}
                    onClearSearch={clearSearchResults}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/:uid/places"
                element={
                  <UsersPlaces
                    searchResults={searchResults}
                    onClearSearch={clearSearchResults}
                  />
                }
              />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route
                path="/user/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/places/all"
                element={
                  <AllPlaces
                    searchResults={searchResults}
                    onClearSearch={clearSearchResults}
                  />
                }
              />
              <Route
                path="/reset-password/:id/:token"
                element={<ResetPassword />}
              />
              <Route path="/auth" element={<Authenticate />} />

              {/* Protected Routes */}
              {token ? (
                <>
                  <Route path="/places/new" element={<NewPlace />} />
                  <Route path="/places/:placeId" element={<UpdatePlace />} />
                  <Route path="/update-profile" element={<UpdateProfile />} />
                </>
              ) : null}

              {/* Catch-all route - Must be last */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </authContext.Provider>
  );
}

export default App;
