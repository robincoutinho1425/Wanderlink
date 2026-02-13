import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  // Generate dynamic className with conditional styles
  const buttonClasses = `
    button button--${props.size || "default"} 
    ${props.inverse ? "button--inverse" : ""} 
    ${props.danger ? "button--danger" : ""} 
    ${props.disabled ? "button--disabled" : ""}
  `;

  if (props.href) {
    return (
      <a className={buttonClasses} href={props.href}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact} className={buttonClasses}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={buttonClasses}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
