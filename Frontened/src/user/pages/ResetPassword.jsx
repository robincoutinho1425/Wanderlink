import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttp } from "../../shared/hooks/http-hook";
import useForm from "../../shared/hooks/useForm";
import "./ResetPassword.css";

import {
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

const ResetPassword = () => {
  const navigate = useNavigate(); // Use navigate hook to navigate between routes
  const { token, id } = useParams(); // Get token and id from URL
  const { sendRequest, error, isLoading, ErrorHandler } = useHttp();
  const [formState, inputHandler, setFormData] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isValid) {
      return; // Prevent submission if the form is invalid
    }

    try {
      await sendRequest(
        `${
          import.meta.env.VITE_BACKENED_URL
        }/users/reset-password/${id}/${token}`, // Correct URL format
        "POST",
        JSON.stringify({ newPassword: formState.inputs.password.value }),
        { "Content-Type": "application/json" }
      );
      navigate("/auth"); // Redirect to login page after successful password reset
      alert("Password updated successfully.");
    } catch (err) {}
  };

  useEffect(() => {
    if (error) {
      ErrorHandler(); // Clear the error after handling it
    }
  }, [error, ErrorHandler]);

  return (
    <div className="flex justify-center">
      <Card className=" h-60px w-60">
        <h2 className="font-bold">Reset Password</h2>
        <form onSubmit={submitHandler} className="h-60px w-60px">
          {error && <ErrorModal error={error} onClear={ErrorHandler} />}
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="password"
            type="password"
            label="New Password"
            value={formState.inputs.password.value}
            onInput={inputHandler}
            placeholder="Enter Password"
            element="input"
            validators={[VALIDATOR_MINLENGTH(5)]} // Add validation for password length
            errorText="Please enter a valid password, at least 5 characters."
          />
          <Button type="submit" disabled={!formState.isValid || isLoading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
