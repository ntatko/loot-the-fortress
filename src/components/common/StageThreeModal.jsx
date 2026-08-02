import React from "react";
import PropTypes from "prop-types";
import Button from "../core/Button";
import Modal from "../core/Modal";
import Wales from "../../assets/wales.svg";
import { ACCOMPLICE, getInventoryImage } from "./Inventory";

/**
 * Fires the moment you own Wales and have enough accomplices to fill it.
 * Announces the conquest stage.
 */
const StageThreeModal = (props) => {
  return (
    <Modal isOpen={props.show} onClose={props.onClose}>
      <div className="modal-header text">Wales is full.</div>

      <div className="text" style={{ fontSize: "1.2rem" }}>
        <p>
          You own <b>wales</b>, and you have 3.2 million{" "}
          <img
            style={{ height: "1.5rem", verticalAlign: "middle" }}
            src={getInventoryImage(ACCOMPLICE)}
            alt={ACCOMPLICE}
          />{" "}
          accomplices standing in it. That is a country. That is, legally
          speaking, a <i>people</i>.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0.5rem",
          }}
        >
          <img style={{ height: "4rem" }} src={Wales} alt="Wales" />
        </div>

        <p>
          So stop stealing coins. Start buying countries. Send a{" "}
          <b>delegation</b> of your accomplices abroad, pay the entry fee, and
          let them get to work — the bigger the delegation, the faster the
          country gets looted.
        </p>
        <p>
          When a delegation finishes, that country's entire population joins
          you, which is how you afford the next one. Keep going until Wales is
          the only country left standing.
        </p>
        <p>
          Two warnings. Accomplices posted abroad are <b>not at home</b>, so
          they stop multiplying your hauls in the fortress until they get back.
          And they keep looting while the game is closed.
        </p>
      </div>

      <Button onClick={props.onClose}>Rule the world</Button>
    </Modal>
  );
};

StageThreeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StageThreeModal;
