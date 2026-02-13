import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
import useForm from "../../shared/hooks/useForm";
import Card from "../../shared/components/UIElements/Card";
import { useHttp } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";

const UpdatePlace = () => {
  const auth = useContext(authContext);
  const { isLoading, error, ErrorHandler, sendRequest } = useHttp();
  const pid = useParams().placeId;
  const navigate = useNavigate();
  const [loadedPlace, setLoadedPlace] = useState([]);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  // const identifiedPlace = userplaces.find((p) => p.id === pid);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const repsonse = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/places/${pid}`
        );

        setLoadedPlace(repsonse);
        setFormData(
          {
            title: {
              value: repsonse.title,
              isValid: true,
            },
            description: {
              value: repsonse.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, pid, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest(
      `${import.meta.env.VITE_BACKENED_URL}/places/${pid}`,
      "PATCH",
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      }
    );
    if (auth.creatorId) {
      navigate(`/${auth.creatorId}/places`);
    } else {
      navigate(`/auth`);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  if (!loadedPlace) {
    return (
      <div className="center">
        <Card>Could not find place!</Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={handleSubmit}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            Initialvalue={loadedPlace.title}
            Initialvalid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            Initialvalue={loadedPlace.description}
            Initialvalid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
