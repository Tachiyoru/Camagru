document.addEventListener("DOMContentLoaded", () => {
	const newCommentInput = document.getElementById("new_comment");
	const addCommentButton = document.getElementById("add-comment");
	const commentsList = document.getElementById("comments-list");
	const pictureId = new URLSearchParams(window.location.search).get("id");
  
	const addComment = () => {
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
			const newCommentHtml = `<div class="comment"><strong>${data.comment.author}:</strong> ${data.comment.text}</div>`;
			commentsList.insertAdjacentHTML('beforeend', newCommentHtml);
			newCommentInput.value = "";
		  } else {
			alert(data.error || 'Failed to add comment');
		  }
		})
		.catch((error) => console.error("Error:", error));
	};
  
	addCommentButton.addEventListener("click", (e) => {
	  e.preventDefault();
	  addComment();
	});
  });
  