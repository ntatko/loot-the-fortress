import React from "react";
import PropTypes from "prop-types";
import Button from "../core/Button";
import Modal from "../core/Modal";
import Wales from "../../assets/wales.svg";
import { formatCount } from "../../utils/format";

/** The actual end of the game. */
const WorldGovernmentModal = (props) => {
  return (
    <Modal isOpen={props.show} onClose={props.onClose}>
      <div className="modal-header text">The World Welsh Government</div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0.5rem",
        }}
      >
        <img style={{ height: "6rem" }} src={Wales} alt="Wales" />
      </div>

      <div className="text" style={{ fontSize: "1.2rem" }}>
        <p>
          Every country on earth has been looted, and every last person in them
          — all {formatCount(props.welshPopulation)} of them — is now Welsh.
        </p>
        <p>
          Wales is the only country left standing. There is nobody left to steal
          from, because there is nobody left who isn't you.
        </p>
        <p>
          It started with a burlap sack and two handfuls of someone else's gold.
        </p>
        <p>
          <b>Croeso i'r byd. Welcome to the world.</b>
        </p>
      </div>

      <Button onClick={props.onClose}>Rest, at last</Button>
    </Modal>
  );
};

WorldGovernmentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  welshPopulation: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WorldGovernmentModal;
