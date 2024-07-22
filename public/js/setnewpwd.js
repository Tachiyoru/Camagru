document
  .getElementById("forgot-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    fetch("/setnew-pwd", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        document.getElementById("loading-screen").classList.add("active");
        return response.json();
      })
      .then((data) => {
        var loadingTime = Math.random() * (4000 - 2000) + 2000;
        setTimeout(() => {
          document.getElementById("loading-screen").classList.remove("active");
          window.location.href = "/homepage";
        }, loadingTime);
      })
      .catch((error) => {
        document.getElementById("error-popup").classList.add("active");
      });
  });

document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("error-popup").classList.remove("active");
});
