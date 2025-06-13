import React from "react";
import PropTypes from "prop-types";
import Button from "../core/Button";
import { useInventory } from "../../context/useInventory";
import Modal from "../core/Modal";

const LoserModal = (props) => {
  const { resetInventory } = useInventory();

  return (
    <Modal
      isOpen={props.show}
      onClose={() => {
        resetInventory();
        window.history.back();
        props.onClose();
      }}
    >
      <div className="modal-header text">You Lost</div>

      <div className="text" style={{ fontSize: "1.2rem" }}>
        <p>Thieving isn't for everyone. Better luck next time!</p>
      </div>

      <Button
        onClick={() => {
          resetInventory();
          window.history.back();
          props.onClose();
        }}
      >
        Start Over
      </Button>
    </Modal>
  );
};

LoserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoserModal;
