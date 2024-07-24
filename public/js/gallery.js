document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  const imagesPerPage = 5;

  function fetchPictures(page) {
    fetch(`/pictures?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        const images = data.images;
        const totalPages = Math.ceil(data.total / imagesPerPage);
        displayImages(images);
        setupPagination(totalPages);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }

  function displayImages(images) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    images.forEach((image) => {
      const imgElement = document.createElement("img");
      imgElement.src = image.path;
      imgElement.alt = image.pictureName;
      imgElement.classList.add("thumbnail");
      imgElement.onclick = () => {
        console.log("clicked", image);
        window.location.href = `/picture-details?id=${imgElement._id}`;
      };
      gallery.appendChild(imgElement);
    });
  }

  function setupPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.disabled = i === currentPage;
      button.addEventListener("click", function () {
        currentPage = i;
        fetchPictures(currentPage);
      });
      pagination.appendChild(button);
    }
  }

  fetchPictures(currentPage);
});
