document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const alert = urlParams.get('alert');

	if (alert) {
        let message;
        switch (alert) {
            case '1':
                message = "Your confirmation token is invalid or has expired. Please renew your request.";
                break;
            case '2':
                message = "Connection expired. Please log in again.";
                break;
            default:
                message = "Default alert message";
        }
        window.alert(message);
    }

	document
	.getElementById("login-form")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		
		const formData = new FormData(event.target);
		fetch("/log-in", {
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

});