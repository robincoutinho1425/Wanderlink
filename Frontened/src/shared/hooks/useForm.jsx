import { useReducer, useCallback } from "react";
const formReducer = (state, action) => {
  let formIsValid = true;
  switch (action.type) {
    case "INPUT_CHANGE":
      for (const inputID in state.inputs) {
        if (!state.inputs[inputID]) {
          continue;
        }
        if (inputID === action.inputID) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputID].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputID]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid, // Update overall form validity
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

const useForm = (InitialInputs, InitialValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: InitialInputs,
    isValid: InitialValidity, // Form is initially invalid
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputID: id,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
export default useForm;
