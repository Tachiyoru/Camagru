const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
let context = canvas.getContext('2d');

let stickers = []; // Array to store stickers' data
let selectedSticker = null;
let offsetX = 0;
let offsetY = 0;
let isResizing = false;

// Accéder à la webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error accessing webcam: ", err));

video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

// Gestion du drag and drop des stickers
document.querySelectorAll('#stickers img').forEach(img => {
    img.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', event.target.src);
    });
});

canvas.addEventListener('dragover', event => {
    event.preventDefault();
});

canvas.addEventListener('drop', event => {
    event.preventDefault();
    const stickerSrc = event.dataTransfer.getData('text/plain');
    const img = new Image();
    img.src = stickerSrc;
    img.onload = () => {
        const sticker = {
            image: img,
            x: event.offsetX - img.width / 2,
            y: event.offsetY - img.height / 2,
            width: img.width,
            height: img.height,
        };
        stickers.push(sticker);
        drawCanvas(); // Redessine la vidéo et les stickers
    };
});

// Fonction pour dessiner la vidéo et les stickers sur le canvas
function drawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    stickers.forEach(sticker => {
        context.drawImage(sticker.image, sticker.x, sticker.y, sticker.width, sticker.height);
    });
}

// Sélectionner un sticker pour le déplacer ou redimensionner
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    selectedSticker = null;
    stickers.forEach(sticker => {
        if (mouseX > sticker.x && mouseX < sticker.x + sticker.width &&
            mouseY > sticker.y && mouseY < sticker.y + sticker.height) {
            selectedSticker = sticker;
            offsetX = mouseX - sticker.x;
            offsetY = mouseY - sticker.y;

            if (mouseX > sticker.x + sticker.width - 10 && mouseY > sticker.y + sticker.height - 10) {
                isResizing = true;
            } else {
                isResizing = false;
            }
        }
    });
});

// Déplacer ou redimensionner un sticker
canvas.addEventListener('mousemove', (event) => {
    if (selectedSticker) {
        if (isResizing) {
            selectedSticker.width = event.offsetX - selectedSticker.x;
            selectedSticker.height = event.offsetY - selectedSticker.y;
        } else {
            selectedSticker.x = event.offsetX - offsetX;
            selectedSticker.y = event.offsetY - offsetY;
        }
        drawCanvas();
    }
});

// Relâcher le sticker
canvas.addEventListener('mouseup', () => {
    selectedSticker = null;
    isResizing = false;
});

// Capturer la photo avec stickers
captureButton.addEventListener('click', () => {
    drawCanvas(); // Redessiner les stickers sur le canvas final
    const imageDataURL = canvas.toDataURL('image/png');
    savePhoto(imageDataURL);
});

// Fonction pour sauvegarder la photo sur le serveur
function savePhoto(imageDataURL) {
    fetch('/save-photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageDataURL }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save photo');
        }
        window.location.href = '/homepage';
    })
    .catch(error => console.error('Error:', error));
}
