import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useAnimatePresence } from "use-animate-presence";

const variants = {
  opacity: { from: 0.8, to: 0 },
};

const FadeOutAction = (props) => {
  const animatedDiv = useAnimatePresence({
    variants,
    initial: "visible",
    animateFirstRender: false,
    exit: props.onExit,
    duration: 2000,
  });

  useEffect(() => {}, []);

  return (
    <>
      {animatedDiv.isRendered && (
        <div ref={animatedDiv.ref}>{props.children}</div>
      )}
    </>
  );
};

FadeOutAction.propTypes = {
  onExit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default FadeOutAction;
