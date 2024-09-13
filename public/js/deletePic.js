document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('delete-button');
	const pictureId = new URLSearchParams(window.location.search).get("id");

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            fetch(`/delete-picture/${pictureId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pictureId }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete picture');
                }
                window.location.href = '/homepage';
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
