document.addEventListener("DOMContentLoaded", () => {
	const newCommentInput = document.getElementById("new_comment");
	const commentsList = document.getElementById("comments-list");
	const pictureId = new URLSearchParams(window.location.search).get("id");
  
	const attachLikeListener = () => {
	  const likeCheckbox = document.getElementById("like-checkbox");
	  
	  likeCheckbox.addEventListener("change", () => {
		const method = likeCheckbox.checked ? "POST" : "DELETE";
  
		fetch(`/like/${pictureId}`, {
		  method: method,
		  headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-cache",
			"Pragma": "no-cache"
		  },
		})
		  .then((response) => {
			if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		  })
		  .then((text) => {
			try {
			  const data = JSON.parse(text);
			  if (data.success) {
				updateLikesCount(data.likesHtml);
			  } else {
				alert(data.error);
			  }
			} catch (error) {
			  console.error("Error parsing JSON:", error);
			}
		  })
		  .catch((error) => console.error("Error:", error));
	  });
	};
  
	const updateLikesCount = (likesHtml) => {
	  const likeContainer = document.querySelector("#like");
	  likeContainer.innerHTML = `
		<h4>Like ${likesHtml}
		<input type="checkbox" id="like-checkbox" ${document.getElementById("like-checkbox").checked ? "checked" : ""} /></h4>
	  `;
	  attachLikeListener(); 
	};
  
	attachLikeListener(); 
  });
