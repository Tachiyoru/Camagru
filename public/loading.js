// app.js

function handleSubmit(event) {
    event.preventDefault();
  
    // Afficher l'écran de chargement
    document.getElementById('loading-screen').style.display = 'block';
  
    // Collecter les données du formulaire
    const formData = new FormData(event.target);
  
    // Effectuer la requête POST vers /login
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      // Rediriger vers la Homepage ou autre page après le login réussi
      window.location.href = '/homepage'; // Mettez à jour l'URL selon votre structure
    })
    .catch(error => {
      console.error('Error:', error);
      // Afficher un message d'erreur ou rediriger vers la page d'accueil / index.html
      window.location.href = '/index.html'; // Redirection vers la page d'accueil en cas d'échec
    })
    .finally(() => {
      // Cacher l'écran de chargement après 2 à 6 secondes (2000 à 6000 ms)
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
      }, Math.random() * 4000 + 2000); // Random pour simuler une attente entre 2 et 6 secondes
    });
  }
  