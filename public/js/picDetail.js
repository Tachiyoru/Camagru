document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pictureId = urlParams.get('id');
    
    if (!pictureId) {
        console.error('No picture ID provided');
        return;
    }

    fetch(`/picture-details?id=${pictureId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.picture) {
                console.error('Picture not found');
                return;
            }
            const pictureDetail = document.getElementById('picture-detail');
            pictureDetail.src = `/images/${data.picture.pictureName}`;
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = ''; // Clear previous comments
            data.comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.textContent = comment.text;
                commentsList.appendChild(commentDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching picture details:', error);
        });
});
