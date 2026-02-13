import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/useForm";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import authContext from "../../shared/context/auth-context";
import { useHttp } from "../../shared/hooks/http-hook";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const navigate = useNavigate();
  const auth = useContext(authContext);
  const { isLoading, error, ErrorHandler, sendRequest } = useHttp();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
   
      await sendRequest(
        `${import.meta.env.VITE_BACKENED_URL}/places`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/");
    } catch (err) {
   
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <ErrorModal error={error} onClear={ErrorHandler} />
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-pink-600 p-4">
          <h2 className="text-xl font-semibold text-white text-center">
            Add a New Place
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {isLoading && (
            <div className="center  ">
              <LoadingSpinner />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              element="input"
              id="title"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              placeholder="Enter title of the place"
              className="mb-2"
            />

            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
              center
              className="mb-2"
            />

            <Input
              element="textarea"
              id="description"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (min. 5 characters)."
              onInput={inputHandler}
              rows={3}
              placeholder="Add a description"
              className="mb-2"
            />

            <Input
              element="input"
              id="address"
              type="text"
              label="Address"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid address."
              onInput={inputHandler}
              className="mb-2"
              placeholder="Please enter a valid address"
            />

            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                inverse
                onClick={() => navigate("/")}
                className="text-sm px-4 py-2"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={!formState.isValid}
                className="text-sm px-4 py-2 "
              >
                ADD PLACE
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPlace;
