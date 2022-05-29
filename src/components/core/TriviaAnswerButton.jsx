import React, { useState } from 'react'
import PropTypes from 'prop-types'

const TriviaAnswerButton = (props) => {
  const {
    children,
    onClick,
    disabled,
    ...rest
  } = props

  const [hover, setHover] = useState(false)

  return (
    <button
        disabled={disabled}
        onMouseEnter={()=>{
            if (!disabled) {
                setHover(true)
            }
        }}
        onMouseLeave={()=>{
            setHover(false);
        }}
        onClick={onClick}
        style={{
            transition: "all 0.2s",
            fontSize: '1.2rem',
            padding: hover ? '0.4rem 0.9rem' : '0.5rem 1rem',
            border: 'none',
            margin: hover ? '0.6rem' : '0.5rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            backgroundColor: disabled ? '#98826b' : '#bb6108',
            color: '#fff',
            fontFamily: 'Syne Mono',
            monospace: 'true',
            fontWeight: 'bold',
            boxShadow: hover ? '3px 6px #535353' : '5px 10px #888888',
            maxWidth: 'calc(100% - 2rem)'
        }}
        {...rest}
    >
      {children}
    </button>
  )
}

TriviaAnswerButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export default TriviaAnswerButton