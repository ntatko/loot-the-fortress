import React from 'react'
import Button from '../core/Button'
import PropTypes from 'prop-types'

const WinningModal = (props) => {

    if (!props.show) {
        return null
    }

    return (
        <div className="modal-container">
            <div className='modal-content'>
                <div className='modal-header text'>🎉🎉🎉 You Won!</div>
                <div className='text' style={{ fontSize: '1.2rem' }}>You can keep playing if you want, or start over to play again.</div>
                <Button onClick={() => {
                    localStorage.setItem('inventoryItems', null)
                    window.history.back()
                }}>Start Over</Button>
                <Button onClick={() => {
                    props.onClose()
                }}>Keep Playing</Button>
            </div>
        </div>
    )
}

WinningModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default WinningModal