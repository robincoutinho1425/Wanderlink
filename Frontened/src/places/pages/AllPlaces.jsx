import { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";

const AllPlaces = ({ searchResults, onClearSearch }) => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();

  // Fetch all places initially
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/places`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.error("Failed to fetch places:", err);
      }
    };

    // Only fetch if we're not showing search results
    if (!searchResults) {
      fetchPlaces();
    } else {
      // Update loaded places with search results
      setLoadedPlaces(searchResults);
    }
  }, [sendRequest, searchResults]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={ErrorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <div className="place-list-container ">
          <h2 className="text-xl font-bold mb-4 text-center">
            {searchResults ? "Search Results" : "All Places"}
          </h2>
          <PlaceList
            places={loadedPlaces}
            onDelete={placeDeletedHandler}
            searchResults={searchResults}
            onClearSearch={onClearSearch}
          />
        </div>
      )}
    </>
  );
};

export default AllPlaces;
