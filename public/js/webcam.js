const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
let context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error accessing webcam: ", err));

captureButton.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/png');
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
        if (response.ok) {
            window.location.href = '/gallery';
        } else {
            console.error('Failed to save photo');
        }
    })
    .catch(error => console.error('Error:', error));
}

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
        context.drawImage(img, event.offsetX - img.width / 2, event.offsetY - img.height / 2);
    };
});
