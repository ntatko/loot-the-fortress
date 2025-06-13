import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = (props) => {
  const { children, onClick, disabled, ...rest } = props;

  return (
    <button className="button" disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
