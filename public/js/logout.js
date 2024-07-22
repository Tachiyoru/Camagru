document.getElementById("logout-form").addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Logout-Form submitted!");
    const formData = new FormData(event.target);
    fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData),
    }).then((response) => {
      console.log("A");
      if (!response.ok) {
        throw new Error("could not logout");
      }
      window.location.href = "/login";
    });
  });
  