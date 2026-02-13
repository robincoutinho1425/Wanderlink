// Users.js
import UserList from "../components/UserList";
import PlaceList from "../../places/components/PlaceList";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttp } from "../../shared/hooks/http-hook";

const Users = ({ searchResults, onClearSearch }) => {
  const [userData, setUserData] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();

  useEffect(() => {
    // Only fetch users if we're not showing search results
    if (!searchResults) {
      const fetchUsers = async () => {
        try {
          const response = await sendRequest(
            `${import.meta.env.VITE_BACKENED_URL}/users`
          );
          setUserData(response.users);
        } catch (err) {}
      };
      fetchUsers();
    }
  }, [sendRequest, searchResults]);

  // This is important: Separate the render logic clearly
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      );
    }

    if (searchResults !== null) {
      return (
        <div className="place-list-container">
          <h2 className="text-xl font-bold mb-4 text-center">
            Search Results ({searchResults.length} places found)
          </h2>
          <PlaceList places={searchResults} />
          <button
            onClick={onClearSearch}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear Search
          </button>
        </div>
      );
    }

    return userData && <UserList items={userData} />;
  };

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      {renderContent()}
    </>
  );
};
export default Users;
