import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../shared/hooks/http-hook";
import authContext from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { Link } from "react-router-dom";
import { Input } from "postcss";
const UpdateProfile = () => {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();

  const [formState, setFormState] = useState({
    name: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormState((prevState) => ({ ...prevState, image: e.target.files[0] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      if (formState.image) {
        formData.append("image", formState.image);
      }

      await sendRequest(
        `${import.meta.env.VITE_BACKENED_URL}/users/${auth.creatorId}`,
        "PATCH",
        formData,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      navigate(`/profile`);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <ErrorModal error={error} onClear={ErrorHandler} />
        <Card className="max-w-2xl mx-auto p-8 ">
          <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
          {isLoading && <LoadingSpinner />}
          {!isLoading && (
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div className="flex  justify-center gap-20">
                <button
                  type="button"
                  className=" bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600"
                >
                  <Link to="/profile">Cancel</Link>
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </>
  );
};

export default UpdateProfile;
