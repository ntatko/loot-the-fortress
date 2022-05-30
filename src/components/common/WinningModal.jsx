import React from 'react'
import Button from '../core/Button'
import PropTypes from 'prop-types'

const WinningModal = (props) => {

    if (!props.show) {
        return null
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', zIndex: '100'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '30rem', height: '20rem', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '2rem', overflow: 'scroll', maxWidth: '100%'}}>
                <div style={{fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true'}}>🎉🎉🎉 You Won!</div>
                <div style={{fontSize: '1.2rem', fontFamily: 'Syne Mono', monospace: 'true'}}> You can keep playing if you want, or start over to play again.</div>
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