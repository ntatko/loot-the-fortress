import React from "react";
import PropTypes from "prop-types";
import Button from "../core/Button";
import { useInventory } from "../../context/useInventory";
import { useWorld } from "../../context/useWorld";
import Modal from "../core/Modal";

const LoserModal = ({ show, onClose = () => {} }) => {
  const { resetInventory } = useInventory();
  const { resetWorld } = useWorld();

  const startOver = () => {
    resetInventory();
    resetWorld();
    window.history.back();
    onClose();
  };

  return (
    <Modal isOpen={show} onClose={startOver}>
      <div className="modal-header text">You Lost</div>

      <div className="text" style={{ fontSize: "1.2rem" }}>
        <p>Thieving isn't for everyone. Better luck next time!</p>
      </div>

      <Button onClick={startOver}>Start Over</Button>
    </Modal>
  );
};

LoserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default LoserModal;
