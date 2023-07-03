import React from 'react';

const Toolbar = ({ colors, selectedColor, handleColorSelection }) => {
    return (
        <div className="App-Toolbar">
            {colors.map((color) => (
                <div
                    key={color}
                    className={`color-option ${color === selectedColor ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelection(color)}
                ></div>
            ))}
        </div>
    );
};

export default Toolbar;
