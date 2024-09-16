document
  .getElementById("previous-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("modal-oldpic").style.display = "flex";
  });

  document.querySelectorAll(".close-button").forEach((button) => {
	button.addEventListener("click", function () {
	  button.parentElement.parentElement.style.display = "none";
	});
  });

  document.addEventListener("DOMContentLoaded", function () {
  
	function fetchPictures() {
	  fetch(`/mypictures`)
		.then((response) => response.json())
		.then((data) => {
		  const images = data;
		  console.log(images);
		  if (images.length !== 0) {
			document.getElementById("previous-button").style.display = "block";
			displayImages(images);
		  }
		})
		.catch((error) => console.error("Error fetching images:", error));
	}

	function displayImages(images) {
		const gallery = document.getElementById("old-pics");
		gallery.innerHTML = "";
		images.forEach((image) => {
		  const imgElement = document.createElement("img");
		  imgElement.src = `data:image/png;base64,${image.ImageData}`;
		  imgElement.alt = image.pictureName;
		  imgElement.classList.add("thumbnail2");
		  gallery.appendChild(imgElement);
		});
	  }

	fetchPictures();
});