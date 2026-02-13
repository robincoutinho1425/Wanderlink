import { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";
import "./Input.css";
const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true, // Mark the input as touched when blurred
      };
    default:
      return state;
  }
};
const Input = (props) => {
  // Initialize state here
  const [state, dispatch] = useReducer(reducer, {
    value: props.Initialvalue || "",
    isValid: props.Initialvalid || false,
    isTouched: false,
  });

  // Destructure the state after initialization
  const { value, isValid } = state;

  const { id, onInput } = props;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const handleChange = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  const handleBlur = () => {
    dispatch({ type: "TOUCH" }); // Mark the input as touched when it loses focus
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        onChange={handleChange}
        onBlur={handleBlur} // Add the onBlur handler here
        placeholder={props.placeholder}
        value={state.value}
      />
    ) : (
      <textarea
        id={props.id}
        value={state.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        onBlur={handleBlur} // Add the onBlur handler here
        rows={props.rows || 3}
      />
    );

  return (
    <div
      className={`form-control ${
        !state.isValid && state.isTouched && "form-control--invalid"
      }`}
    >
      <form>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!state.isValid && state.isTouched && (
          <p className="text-red-400">{props.errorText}</p>
        )}
      </form>
    </div>
  );
};

export default Input;
