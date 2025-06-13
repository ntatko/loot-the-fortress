import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Button.css";
import Button from "./Button";

const ButtonLink = (props) => {
  const { children, to, disabled, onClick, ...rest } = props;

  if (disabled) {
    return (
      <Button className="button" disabled>
        {children}
      </Button>
    );
  }

  return (
    <Link to={to} className="button" onClick={onClick} {...rest}>
      {children}
    </Link>
  );
};

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ButtonLink;
