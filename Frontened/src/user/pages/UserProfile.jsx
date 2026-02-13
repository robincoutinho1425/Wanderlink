// UserProfile.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttp } from "../../shared/hooks/http-hook";
import authContext from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Button from "../../shared/components/FormElements/Button";
import { User, MapPin, Calendar, Edit, Mail } from "lucide-react";
import "./UserProfile.css";

const UserProfile = () => {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [placeCount, setPlaceCount] = useState(0);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the userId from URL params, or fall back to logged-in user's ID
        const targetUserId = userId || auth.creatorId;

        if (!targetUserId) {
          return; // Exit if no valid user ID
        }

        const userData = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/users/${targetUserId}`
        );
        if (!userData || !userData.user) {
          setNotFound(true);
          return;
        }
        setUserData(userData.user);
        const placesData = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/places/user/${targetUserId}`
        );

        setPlaceCount(placesData.places.length);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, [sendRequest, userId, auth.creatorId]);

  const handleEditClick = () => {
    navigate("/update-profile");
  };

  useEffect(() => {
    if (notFound) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notFound, navigate]);

  const handleViewPlaces = () => {
    const targetUserId = userId || auth.creatorId;
    navigate(`/${targetUserId}/places`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    // If account is less than a month old, show days
    if (diffDays === 1) {
      return "Joined Today";
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }
    // If account is less than a year old, show months
    else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
    }
    // For accounts older than a year
    else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Check if this is the logged-in user's own profile
  const isOwnProfile = userId === auth.creatorId || (!userId && auth.creatorId);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Sorry, this user profile doesn't exist or has been removed.
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to home page in a few seconds...
          </p>
        </Card>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={ErrorHandler} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && !userData && (
          <div className="flex justify-center items-center h-64">
            <Card>
              <h2>Could not find user!</h2>
            </Card>
          </div>
        )}

        {!isLoading && userData && (
          <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>

              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                  {userData.image ? (
                    <img
                      src={`${import.meta.env.VITE_IMAGE_URL}/${
                        userData.image
                      }`}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                      <User size={52} className="text-yellow-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-24 pb-8 px-8">
              <div className="text-center mb-8 relative">
                {isOwnProfile && (
                  <button
                    onClick={handleEditClick}
                    className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                    title="Edit Profile"
                  >
                    <Edit
                      size={20}
                      className="text-gray-600 hover:text-yellow-600"
                    />
                  </button>
                )}

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  {userData.name}
                </h1>

                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span>{userData.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-yellow-600" />
                    <h3 className="font-semibold text-gray-800">
                      Places Shared
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">
                    {placeCount}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Total locations shared with the community
                  </p>
                </div>
                {/* Member Since card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                      Member Since
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatDate(userData.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Joined{" "}
                    {new Date(userData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={handleViewPlaces}>View Places</Button>
                {isOwnProfile && (
                  <Button onClick={handleEditClick} inverse>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default UserProfile;
