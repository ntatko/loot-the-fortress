import React from "react"
import PropTypes from 'prop-types'
import Button from "../core/Button"

const LoserModal = (props) => {

    return (
        props.show
            ? (
                <div onClick={() => props.onClose()} className="modal-container" >
                    <div onClick={(e) => e.stopPropagation()} className="modal-content">
                        <div className="modal-header text">You Lost</div>

                        <div className="text" style={{ fontSize: '1.2rem' }}>
                            <p>
                                Thieving isn't for everyone. Better luck next time!
                            </p>
                        </div>

                        <Button onClick={() => {
                            localStorage.setItem('inventoryItems', null)
                            window.history.back()
                            props.onClose()
                        }}>Start Over</Button>
                    </div>
                </div>
            )
            : null)
}

LoserModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default LoserModal