document.addEventListener("DOMContentLoaded", () => {
  const likeCheckbox = document.getElementById("like-checkbox");
  const newCommentInput = document.getElementById("new_comment");
  const commentsList = document.getElementById("comments-list");
  const pictureId = new URLSearchParams(window.location.search).get("id"); // Assuming picture id is in URL

  likeCheckbox.addEventListener("change", () => {
    const method = likeCheckbox.checked ? "POST" : "DELETE";

    fetch(`/like/${pictureId}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache", // Eviter la mise en cache
        "Pragma": "no-cache"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("test");
          const likesCount = document.querySelector("#like");
          likesCount.innerHTML = `Like ${
            data.likesHtml
          } <input type="checkbox" id="like-checkbox" ${
            likeCheckbox.checked ? "checked" : ""
          } />`;
          // document.getElementById('likes-count').innerText = data.likesHtml;
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  newCommentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const commentText = newCommentInput.value;
      if (!commentText) return;

      fetch(`/comment/${pictureId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            commentsList.innerHTML += `<div><strong>${data.author}:</strong> ${data.text}</div>`;
            newCommentInput.value = "";
          } else {
            alert(data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });
});
