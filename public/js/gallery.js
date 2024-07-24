document.addEventListener("DOMContentLoaded", function() {
    fetch('/pictures')
      .then(response => response.json())
      .then(images => {
        const gallery = document.getElementById('feed');
        images.forEach(image => {
          const imgElement = document.createElement('img');
          imgElement.src = `${image.path}`;
          imgElement.alt = image.pictureName;
          gallery.appendChild(imgElement);
        });
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  });
  