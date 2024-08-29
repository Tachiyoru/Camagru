document.addEventListener("DOMContentLoaded", function () {
	const urlParams = new URLSearchParams(window.location.search);
    const pictureId = urlParams.get('id');
    const gifContainer = document.createElement('div');
    gifContainer.style.position = 'absolute';
    gifContainer.style.top = '0';
    gifContainer.style.left = '0';
    gifContainer.style.width = '100%';
    gifContainer.style.height = '100%';
    gifContainer.style.pointerEvents = 'none';

   
    const pictureDetail = document.getElementById('picture-detail');
    pictureDetail.parentElement.style.position = 'relative';
    pictureDetail.parentElement.appendChild(gifContainer);

   
async function fetchGifs(pictureId) {
    try {
        const response =  await fetch(`/gifs/${pictureId}`);
        const data = await response.json();
        
        if (data.success) {
            const gifs = data.gifs;
            displayGifs(gifs);
        } else {
            console.error('Failed to retrieve GIFs');
        }
    } catch (error) {
        console.error('Error fetching GIFs:', error);
    }
}

function displayGifs(gifs) {
    const pictureDetail = document.getElementById('picture-detail');
    if (!pictureDetail) {
        console.error('Image element not found');
        return;
    }

    gifs.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.src; 
        img.style.position = 'absolute';
        img.style.top = `${gif.y}px`;
        img.style.left = `${gif.x}px`;
        img.style.width = '100px'; 
        img.style.height = '100px'; 
        img.alt = 'GIF';

        pictureDetail.parentElement.appendChild(img); 
    });
}

   
    fetchGifs(pictureId);
});
