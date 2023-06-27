import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers'

const Canvas = ({ selectedColor, ethernal, provider, pixelArray }) => {
    const canvasRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [editablePixels, setEditablePixels] = useState([]);



    //const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const pixelSize = 25;
    const canvasWidth = 11;
    const canvasHeight = 11;
    const borderColor = '#000000';

    const isPixelColored = (x, y) => {
        return pixelArray.some(p => p.x === x && p.y === y);
    };

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

        // Dessiner les pixels éditables (blancs)
        for (let i = 0; i < canvasHeight; i++) {
            for (let j = 0; j < canvasWidth; j++) {
                drawPixel(ctx, j, i, 'white');
            }
        }

        // Dessiner les pixels en cours d'édition
        for (let i = 0; i < editablePixels.length; i++) {
            const pixel = editablePixels[i];
            const { x, y, color } = pixel;
            drawPixel(ctx, x, y, color);
        }

        // Dessiner les pixels de la blockchain
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
        const existingPixelIndex = newEditablePixels.findIndex(p => p.x === x && p.y === y);

        if (selectedColor === 'white') {
            // L'utilisateur a sélectionné la couleur blanche, on supprime le pixel s'il existe
            if (existingPixelIndex !== -1) {
                newEditablePixels.splice(existingPixelIndex, 1);
            }
        } else {
            // L'utilisateur a sélectionné une couleur différente de blanche
            if (existingPixelIndex !== -1) {
                // Le pixel existe déjà, on met à jour sa couleur
                const updatedPixel = { ...newEditablePixels[existingPixelIndex], color: selectedColor };
                newEditablePixels[existingPixelIndex] = updatedPixel;
            } else {
                // Le pixel n'existe pas, on l'ajoute avec la couleur sélectionnée
                const newPixel = { x, y, color: selectedColor };
                newEditablePixels.push(newPixel);
            }
        }

        //Retourne tableau de dict
        console.log(newEditablePixels);

        setEditablePixels(newEditablePixels);
    };

    const handleConfirmClick = async () => {
        if (editablePixels.length < 1) {
            // Afficher un message d'erreur ou empêcher l'exécution de la transaction
            alert("Dessine d'abord frère.")
            return;
        }
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const numPixels = editablePixels.length;
        const pixelCost = ethers.utils.parseEther((numPixels * 0.1).toString());

        // Vérifier que l'utilisateur dispose de suffisamment de fonds pour les pixels
        const balance = await provider.getBalance(account);
        if (balance.lt(pixelCost)) {
            alert("Solde insuffisant pour créer les pixels");
            return;
        }

        // Créer un tableau de pixels à partir du tableau editablePixels
        const pixelsToSend = editablePixels.map(pixel => ({
            x: pixel.x,
            y: pixel.y,
            color: pixel.color
        }));

        // Afficher une alerte avec le nombre de pixels qui seront envoyés à la blockchain
        alert(`Vous êtes sur le point de créer ${numPixels} pixel(s) dans la blockchain.\nCoût total : ${ethers.utils.formatEther(pixelCost)} ETH`);

        // Appeler la fonction createPixel du contrat dans la blockchain
        const transaction = await ethernal.connect(signer).createPixels(pixelsToSend, { value: pixelCost });
        await transaction.wait();

        // Réinitialiser le tableau editablePixels après avoir créé les pixels dans la blockchain
        setEditablePixels([]);

        // Rafraîchir la page pour afficher les nouveaux pixels depuis la blockchain. (Pas ouf fonctionne à moitié)
        window.location.reload();

    };

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
                }}
            />
            <button type="button" className='confirm' onClick={handleConfirmClick}>Confirm</button>
        </div>
    );
};






export default Canvas;