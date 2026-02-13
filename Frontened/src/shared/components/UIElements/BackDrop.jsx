import React from "react";
import ReactDOM from "react-dom";

import "./BackDrop.css";

const Backdrop = (props) => {
  return (
    <div
      className="backdrop  fixed inset-0 bg-zinc-400"
      onClick={props.onClick}
    ></div>
  );
};

export default Backdrop;
