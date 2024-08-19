document.addEventListener("DOMContentLoaded", () => {
	const newCommentInput = document.getElementById("new_comment");
	const commentsList = document.getElementById("comments-list");
	const pictureId = new URLSearchParams(window.location.search).get("id");
  
	newCommentInput.addEventListener("keydown", (e) => {
	  if (e.key === "Enter") {
		const commentText = newCommentInput.value.trim();
		if (!commentText) return;
  
		fetch(`/comment/${pictureId}`, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({ text: commentText }),
		})
		  .then((response) => {
			if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		  })
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
  