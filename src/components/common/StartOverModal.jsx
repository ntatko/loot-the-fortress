import React from "react";
import Button from "../core/Button";
import { useInventory } from "../../context/useInventory";
import Modal from "../core/Modal";
import PropTypes from "prop-types";

const StartOverModal = ({ onClose }) => {
  const { resetInventory } = useInventory();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="modal-header">
        <span className="text">Start Over?</span>
      </div>
      <div className="modal-body text">
        <p>
          Are you sure you want to start over? This will erase all your progress
          and start you over.
        </p>
      </div>
      <div className="modal-footer">
        <Button
          className="btn btn-danger"
          onClick={() => {
            resetInventory();
            window.location.reload();
          }}
        >
          Start Over
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

StartOverModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default StartOverModal;
