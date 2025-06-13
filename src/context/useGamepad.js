import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const GamepadContext = createContext();

export const useGamepad = () => {
    const context = useContext(GamepadContext);
    if (!context) {
        throw new Error('useGamepad must be used within a GamepadProvider');
    }
    return context;
};

export const GamepadProvider = ({ children }) => {
    const [gamepad, setGamepad] = useState(null);
    const [buttons, setButtons] = useState({});
    const [axes, setAxes] = useState({});
    const lastDpadState = useRef({ up: false, down: false, left: false, right: false });

    const simulateKeyboardEvent = (key, options = {}) => {
        // Create and dispatch both keydown and keyup events
        const keydownEvent = new KeyboardEvent('keydown', { key, ...options, bubbles: true });
        const keyupEvent = new KeyboardEvent('keyup', { key, ...options, bubbles: true });
        
        // Find the currently focused element
        const activeElement = document.activeElement;
        if (activeElement) {
            activeElement.dispatchEvent(keydownEvent);
            activeElement.dispatchEvent(keyupEvent);
        }
    };

    useEffect(() => {
        const handleGamepadConnected = (e) => {
            setGamepad(e.gamepad);
        };

        const handleGamepadDisconnected = () => {
            setGamepad(null);
            setButtons({});
            setAxes({});
        };

        const updateGamepadState = () => {
            if (gamepad) {
                const gp = navigator.getGamepads()[gamepad.index];
                if (gp) {
                    const buttonStates = {};
                    gp.buttons.forEach((button, index) => {
                        buttonStates[index] = button.pressed;
                    });

                    const axesStates = {
                        leftStick: { x: gp.axes[0], y: gp.axes[1] },
                        rightStick: { x: gp.axes[2], y: gp.axes[3] }
                    };

                    // Handle D-pad and stick navigation
                    const dpadUp = buttonStates[12] || axesStates.leftStick.y < -0.5;
                    const dpadDown = buttonStates[13] || axesStates.leftStick.y > 0.5;
                    const dpadLeft = buttonStates[14] || axesStates.leftStick.x < -0.5;
                    const dpadRight = buttonStates[15] || axesStates.leftStick.x > 0.5;

                    // Simulate keyboard events for navigation
                    if (dpadUp && !lastDpadState.current.up) {
                        simulateKeyboardEvent('Tab', { shiftKey: true });
                    }
                    if (dpadDown && !lastDpadState.current.down) {
                        simulateKeyboardEvent('Tab');
                    }
                    if (dpadLeft && !lastDpadState.current.left) {
                        simulateKeyboardEvent('Tab', { shiftKey: true });
                    }
                    if (dpadRight && !lastDpadState.current.right) {
                        simulateKeyboardEvent('Tab');
                    }

                    // Handle A button press (button 0) as Enter key
                    if (buttonStates[0]) {
                        simulateKeyboardEvent('Enter');
                    }

                    lastDpadState.current = { up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight };
                    setButtons(buttonStates);
                    setAxes(axesStates);
                }
            }
            requestAnimationFrame(updateGamepadState);
        };

        window.addEventListener('gamepadconnected', handleGamepadConnected);
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
        
        const animationFrame = requestAnimationFrame(updateGamepadState);

        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnected);
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
            cancelAnimationFrame(animationFrame);
        };
    }, [gamepad]);

    return (
        <GamepadContext.Provider value={{ isConnected: !!gamepad, buttons, axes }}>
            {children}
        </GamepadContext.Provider>
    );
};
