import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import useForm from "../../shared/hooks/useForm";
import Button from "../../shared/components/FormElements/Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useEffect } from "react";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";
import { useHttp } from "../../shared/hooks/http-hook";
import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
import "./Authenticate.css";
const Authenticate = () => {
  const auth = useContext(authContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [hasUsers, setHasUsers] = useState(false);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const navigate = useNavigate();
  const switchModeHandler = () => {
    if (!isLoginMode) {
      // Switching to Login mode
      setFormData(
        {
          ...formState.inputs,
          name: undefined, // Remove the name field
          userName: undefined, // Remove the username field
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      // Switching to Sign-up mode
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          userName: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false // Form is initially invalid for sign-up
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  ); // InitialValidity

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (!isLoginMode) {
      try {
        const formData = new FormData();

        formData.append("image", formState.inputs.image.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("userName", formState.inputs.userName.value);
        const data = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/users/signup`,
          "POST",
          formData,
          {
            credentials: "include",
          }
        );
        auth.login(data.userId, data.token);
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    } else {
      try {
        const data = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
            credentials: "include",
          }
        );
        auth.login(data.userId, data.token);

        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchHasUsers = async () => {
      try {
        const data = await sendRequest(
          `${import.meta.env.VITE_BACKENED_URL}/users/hasUsers`
        );

        setHasUsers(data.hasUsers);
        if (!data.hasUsers) {
          setIsLoginMode(false); // Default to signup mode if no users exist
        }
      } catch (err) {}
    };

    fetchHasUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      <div className="flex justify-center">
        <Card className="authentication">
          {isLoading && <LoadingSpinner asOverlay />}
          {!isLoginMode ? <h2>Create Your Account</h2> : <h2>Login </h2>}
          <hr />
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <>
                <Input
                  element="input"
                  id="name"
                  type="text"
                  label="Your Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a name."
                  onInput={inputHandler}
                />
                <Input
                  element="input"
                  id="userName"
                  type="text"
                  label="Add your username"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(10)]}
                  errorText="Please enter a unique username upto 10 characters"
                  onInput={inputHandler}
                />
                <ImageUpload id="image" center onInput={inputHandler} />
              </>
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid password, at least 5 characters."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "LOGIN" : "SIGNUP"}
            </Button>
            {isLoginMode && (
              <Link
                to="/user/forgot-password"
                className="inline-block px-4 py-2 text-blue-500 hover:text-blue-900 
    transition-all duration-300 hover:scale-105 
    relative after:content-[''] after:absolute after:w-0 
    after:h-0.5 after:left-0 after:bottom-0 
    after:bg-blue-500 hover:after:w-full 
    after:transition-all after:duration-300"
              >
                Forgot Password?
              </Link>
            )}
          </form>

          <Button inverse onClick={switchModeHandler} disabled={!hasUsers}>
            SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Authenticate;
