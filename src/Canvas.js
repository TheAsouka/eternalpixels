import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers'

const Canvas = ({ selectedColor, ethernal, provider }) => {
    const canvasRef = useRef(null);
    const [pixels, setPixels] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);

    //const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const pixelSize = 25;
    const canvasWidth = 11;
    const canvasHeight = 11;
    const borderColor = '#000000';

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Dessine les pixels sur le canvas
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                const pixelColor = pixels[x + y * canvasWidth] || 'white';
                ctx.fillStyle = pixelColor;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }, [pixels]);


    const handleMouseMove = (e) => {
        if (isMouseDown) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / pixelSize);
            const y = Math.floor((e.clientY - rect.top) / pixelSize);
            handlePixelClick(x, y);
        }
    };

    const handlePixelClick = (x, y) => {
        // Met à jour la couleur du pixel cliqué
        const newPixels = [...pixels];
        //Random color
        //newPixels[x + y * (canvasWidth)] = colors[Math.floor(Math.random() * colors.length)];
        console.log(selectedColor)
        if (selectedColor === "white") {
            newPixels[x + y * (canvasWidth)] = undefined;
            setPixels(newPixels);
            console.log(newPixels);
            console.log("PIXEL RESET !")

        } else {
            console.log(x, y, selectedColor)
            newPixels[x + y * (canvasWidth)] = selectedColor;
            setPixels(newPixels);
            console.log(newPixels);
        }

        return x, y

    };

    const handleConfirmClick = async (_id, _x, _y, _color) => {
        console.log("CLICK")
        const signer = await provider.getSigner()
        const transaction = await ethernal.connect(signer).createPixel(_id, _x, _y, _color, { value: 0 })
        await transaction.wait()
    }

    return (
        <div>
            <canvas
                id="grid"
                className='App-Canvas'
                ref={canvasRef}
                width={canvasWidth * pixelSize}
                height={canvasHeight * pixelSize}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
                onMouseMove={handleMouseMove}
                onClick={(e) => {
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = Math.floor((e.clientX - rect.left) / pixelSize);
                    const y = Math.floor((e.clientY - rect.top) / pixelSize);
                    handlePixelClick(x, y);
                    handleConfirmClick(11, x, y, selectedColor);
                }}
            />
            <button type="button" className='confirm' onClick={handleConfirmClick}>Confirm</button>
        </div>
    );
};






export default Canvas;