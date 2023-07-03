import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

const Canvas = ({ selectedColor, ethernal, provider, pixelArray }) => {
    const canvasRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [editablePixels, setEditablePixels] = useState([]);


    const pixelSize = 25;
    const canvasWidth = 22;
    const canvasHeight = 50;
    const borderColor = '#000000';


    const drawPixel = (ctx, x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw base canvas
        for (let i = 0; i < canvasHeight; i++) {
            for (let j = 0; j < canvasWidth; j++) {
                drawPixel(ctx, j, i, 'white');
            }
        }

        // Draw pixels being edited
        for (let i = 0; i < editablePixels.length; i++) {
            const pixel = editablePixels[i];
            const { x, y, color } = pixel;
            drawPixel(ctx, x, y, color);
        }

        // Draw pixel from blockchain
        for (let i = 0; i < pixelArray.length; i++) {
            const pixel = pixelArray[i];
            const { x, y, color } = pixel;
            drawPixel(ctx, x, y, color);
        }

    }, [pixelArray, editablePixels]);


    const handleMouseMove = (e) => {
        if (isMouseDown) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / pixelSize);
            const y = Math.floor((e.clientY - rect.top) / pixelSize);
            handlePixelClick(x, y);
        }
    };

    const handlePixelClick = (x, y) => {
        const newEditablePixels = [...editablePixels];
        //Avoid creating pixels outside of the canvas.
        if (x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight) {
            const existingPixelIndex = newEditablePixels.findIndex((p) => p.x === x && p.y === y);

            // To improve.
            // Sometimes canva isn't updated correctly after a refresh
            // create an non editable array from pixelArray (blockchain data)
            const nonEditablePixels = pixelArray.map((pixel) => ({
                x: Number(pixel.x),
                y: Number(pixel.y),
                color: pixel.color,
            }));

            const isNonEditablePixel = nonEditablePixels.some(
                (pixel) => pixel.x === x && pixel.y === y
            );

            if (isNonEditablePixel) {
                console.log("Pixel already in blockchain.")
                return;
            }

            if (selectedColor === 'white') {
                // If user select white, delete the pixel if it exist
                if (existingPixelIndex !== -1) {
                    newEditablePixels.splice(existingPixelIndex, 1);
                }
            } else {
                if (existingPixelIndex !== -1) {
                    // Pixel already exist, update the color
                    const updatedPixel = { ...newEditablePixels[existingPixelIndex], color: selectedColor };
                    newEditablePixels[existingPixelIndex] = updatedPixel;
                } else {
                    // Pixel doesn't exist, add it to the array
                    const newPixel = { x, y, color: selectedColor };
                    newEditablePixels.push(newPixel);
                }
            }
        }

        //Array of dict
        console.log(newEditablePixels);

        setEditablePixels(newEditablePixels);
    };


    const handleConfirmClick = async () => {
        if (editablePixels.length < 1) {
            Swal.fire({
                icon: 'error',
                title: "You didn't draw any pixel",
                text: "Please edit some pixels before confirming.",
            })
            return;
        }

        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const numPixels = editablePixels.length;
        const pixelCost = ethers.utils.parseEther((numPixels * 0.1).toString());

        // Check if user balance is greater than total cost
        const balance = await provider.getBalance(account);
        if (balance.lt(pixelCost)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Insufficient funds to create ${numPixels} pixel(s)`,
            })
            return;
        }

        // Create array of pixels from editablePixels array
        const pixelsToSend = editablePixels.map(pixel => ({
            x: pixel.x,
            y: pixel.y,
            color: pixel.color
        }));

        Swal.fire({
            icon: 'warning',
            title: 'Confirm transaction',
            text: `You are about to send ${numPixels} pixel(s) in the blockchain.\nTotal cost : ${ethers.utils.formatEther(pixelCost)} ETH`,
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Call the createPixels fonction of the smart contract
                    const transaction = await ethernal.connect(signer).createPixels(pixelsToSend, { value: pixelCost });
                    await transaction.wait();

                    // Success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Transaction validated',
                        text: 'New pixels have been added to the blockchain !',
                    }).then((result) => {
                        // Refresh page after clicking "OK"
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } catch (error) {
                    // Error handling
                    Swal.fire({
                        icon: 'error',
                        title: 'Transaction failed',
                        text: 'Check the nonce',
                    });
                    console.error(error);
                }
            }
        });
    };

    return (
        <div>
            <button type="button" className='confirm' onClick={handleConfirmClick}>Confirm</button>
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
                }}
            />
            <button type="button" className='confirm' onClick={handleConfirmClick}>Confirm</button>
        </div>
    );
};






export default Canvas;