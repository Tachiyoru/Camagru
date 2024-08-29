const video = document.getElementById('video');
const canvasBackground = document.getElementById('canvas-background');
const canvasStickers = document.getElementById('canvas-stickers');
const uploadImageInput = document.getElementById('upload-image');
const captureButton = document.getElementById('capture-button');
const uploadButton = document.getElementById('upload-button');
const contextBackground = canvasBackground.getContext('2d');
const contextStickers = canvasStickers.getContext('2d');

let stickers = [];
let selectedSticker = null;
let offsetX = 0;
let offsetY = 0;
let isResizing = false;
let isImageUploaded = false; 


navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error accessing webcam: ", err));

video.addEventListener('loadedmetadata', () => {
    canvasBackground.width = video.videoWidth;
    canvasBackground.height = video.videoHeight;
    canvasStickers.width = video.videoWidth;
    canvasStickers.height = video.videoHeight;
    if (!isImageUploaded) { 
        drawVideoOnCanvas(); 
    }
});


function drawVideoOnCanvas() {
    if (!isImageUploaded) { 
        contextBackground.drawImage(video, 0, 0, canvasBackground.width, canvasBackground.height);
        requestAnimationFrame(drawVideoOnCanvas); 
    }
}


uploadButton.addEventListener('click', () => {
    uploadImageInput.click(); 
});

uploadImageInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                isImageUploaded = true; 
                contextBackground.clearRect(0, 0, canvasBackground.width, canvasBackground.height); 
                contextBackground.drawImage(img, 0, 0, canvasBackground.width, canvasBackground.height); 
                video.pause(); 
                video.style.display = 'none'; 
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


function resetToWebcam() {
    isImageUploaded = false;
    contextBackground.clearRect(0, 0, canvasBackground.width, canvasBackground.height);
    video.play();
    video.style.display = 'block'; 
    drawVideoOnCanvas(); 
}


document.querySelectorAll('#stickers img').forEach(img => {
    img.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', event.target.src);
    });
});

canvasStickers.addEventListener('dragover', event => {
    event.preventDefault();
});

canvasStickers.addEventListener('drop', event => {
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
        drawStickersOnCanvas(); 
    };
});

canvasStickers.addEventListener('mousedown', (event) => {
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

canvasStickers.addEventListener('mousemove', (event) => {
    if (selectedSticker) {
        if (isResizing) {
            selectedSticker.width = event.offsetX - selectedSticker.x;
            selectedSticker.height = event.offsetY - selectedSticker.y;
        } else {
            selectedSticker.x = event.offsetX - offsetX;
            selectedSticker.y = event.offsetY - offsetY;
        }
        drawStickersOnCanvas();
    }
});

canvasStickers.addEventListener('mouseup', () => {
    selectedSticker = null;
    isResizing = false;
});

function drawStickersOnCanvas() {
    contextStickers.clearRect(0, 0, canvasStickers.width, canvasStickers.height);
    stickers.forEach(sticker => {
        contextStickers.drawImage(sticker.image, sticker.x, sticker.y, sticker.width, sticker.height);
    });
}

captureButton.addEventListener('click', () => {
    drawStickersOnCanvas();
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvasBackground.width;
    finalCanvas.height = canvasBackground.height;
    const finalContext = finalCanvas.getContext('2d');

    
    finalContext.drawImage(canvasBackground, 0, 0);
    finalContext.drawImage(canvasStickers, 0, 0);

    const imageDataURL = finalCanvas.toDataURL('image/png');
    savePhoto(imageDataURL);
});

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
