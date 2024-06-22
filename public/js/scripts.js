document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher le formulaire de soumettre normalement

    console.log("Form submitted!");
    const formData = new FormData(event.target);

    fetch("/login", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: new URLSearchParams(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        document.getElementById("loading-screen").classList.add("active");
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        window.location.href = "/";
      })
      .finally(() => {
        var loadingTime = Math.random() * (4000 - 2000) + 2000;
        setTimeout(() => {
          // console.log("Authentication successful", response.json());
          document.getElementById("loading-screen").classList.remove("active");
          window.location.href = "/homepage";
        }, loadingTime);
      });
  });
