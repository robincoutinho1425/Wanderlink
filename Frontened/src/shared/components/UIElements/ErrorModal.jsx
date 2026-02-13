import React from "react";
import Modal from "./Modal";
import Button from "../FormElements/Button";
import { useNavigate } from "react-router-dom";

const ErrorModal = (props) => {
  const navigate = useNavigate();
  const handleClose = () => {
    // First clear the error
    props.onClear();
    // Then navigate to home page
  };

  return (
    <Modal
      onCancel={handleClose}
      header="An Error Occurred!"
      show={!!props.error}
      footer={
        <Button onClick={handleClose} className="bg-blue-500 text-white">
          Okay
        </Button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
