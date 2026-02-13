import { useHttp } from "../../shared/hooks/http-hook";
import useForm from "../../shared/hooks/useForm";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_EMAIL } from "../../shared/util/validators";

const ForgotPassword = () => {
  const { sendRequest, error, isLoading, ErrorHandler } = useHttp();

  // Using useForm for managing input state and validation
  const [formState, inputHandler] = useForm(
    {
      email: { value: "", isValid: false },
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
        `${import.meta.env.VITE_BACKENED_URL}/users/forgot-password`,
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
        }),
        { "Content-Type": "application/json" }
      );
      alert("Password reset link sent. Check your email.");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={ErrorHandler} />
      <div className="flex justify-center">
        <Card className="h-70 w-1/4 space-y-10">
          <h2 className="font-bold">Forgot Password</h2>
          <form onSubmit={submitHandler}>
            <Input
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
              placeholder="Enter email"
              element="input"
            />
            <Button type="submit" disabled={!formState.isValid || isLoading}>
              {isLoading ? "Sending..." : "Request Reset Link"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;
