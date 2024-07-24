document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("picModal");
  const modalImg = document.getElementById("img01");
  const closeModal = document.getElementsByClassName("close")[0];

  document
    .getElementById("gallery")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("thumbnail")) {
        modal.style.display = "block";
        modalImg.src = event.target.src;
      }
    });

  closeModal.onclick = function () {
    modal.style.display = "none";
  };
});
