function checkFormFields() {
  const username = document.getElementById("new_username").value.trim();
  const email = document.getElementById("new_email").value.trim();
  const password = document.getElementById("new_password").value.trim();

  document.getElementById("update-button").disabled = !(
    username ||
    email ||
    password
  );
}

document.querySelectorAll("#update-form input").forEach((input) => {
  input.addEventListener("input", checkFormFields);
});

document.addEventListener("DOMContentLoaded", checkFormFields);

document
  .getElementById("change-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("change-modal").style.display = "block";
  });

document.querySelectorAll(".close-button").forEach((button) => {
  button.addEventListener("click", function () {
    button.parentElement.parentElement.style.display = "none";
  });
});

document
  .getElementById("update-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // document.getElementById("change-modal").style.display = "none";
    document.getElementById("password-modal").style.display = "block";
  });

document
  .getElementById("password-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const currentPassword = document.getElementById("current_password").value;
    const formData = new FormData(document.getElementById("update-form"));
    formData.append("current_password", currentPassword);

    fetch("/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user information");
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while updating user information.");
      });
  });
