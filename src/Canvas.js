import React, { useState, useRef, useEffect } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [pixels, setPixels] = useState([]);

    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const pixelSize = 5;
    const canvasSize = 100;
    const gridSize = 10;
    const gridColor = '#CCCCCC';

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Dessine la grille grise en arrière-plan
        ctx.fillStyle = gridColor;
        for (let x = 0; x < canvasSize; x += gridSize) {
            for (let y = 0; y < canvasSize; y += gridSize) {
                ctx.fillRect(x * pixelSize, y * pixelSize, gridSize * pixelSize, gridSize * pixelSize);
            }
        }

        // Dessine les pixels sur le canvas
        for (let x = 0; x < canvasSize; x++) {
            for (let y = 0; y < canvasSize; y++) {
                const pixelColor = pixels[x + y * canvasSize] || 'white';
                ctx.fillStyle = pixelColor;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }, [pixels]);

    const handlePixelClick = (x, y) => {
        // Met à jour la couleur du pixel cliqué
        const newPixels = [...pixels];
        newPixels[x + y * canvasSize] = colors[Math.floor(Math.random() * colors.length)];
        setPixels(newPixels);
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={canvasSize * pixelSize}
                height={canvasSize * pixelSize}
                onClick={(e) => {
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = Math.floor((e.clientX - rect.left) / pixelSize);
                    const y = Math.floor((e.clientY - rect.top) / pixelSize);
                    handlePixelClick(x, y);
                }}
            />
        </div>
    );
};

export default Canvas;
