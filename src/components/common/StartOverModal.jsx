import React from "react"
import Button from "../core/Button";

const StartOverModal = (props) => {
  return (
    <div className="modal-container" onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="text">Start Over?</span>
        </div>
        <div className="modal-body text">
          <p>
            Are you sure you want to start over? This will erase all your
            progress and start you over.
          </p>
        </div>
        <div className="modal-footer">
          <Button
            className="btn btn-danger"
            onClick={() => {
                window._paq.push(['trackEvent', 'Home', 'startOver']);
                localStorage.setItem('inventoryItems', null)
                window.location.reload()
            }}
          >
            Start Over
          </Button>
          <Button onClick={props.onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StartOverModal