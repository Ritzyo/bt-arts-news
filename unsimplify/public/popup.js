document.addEventListener('DOMContentLoaded', function () {
    // Fetch your data from an external source, e.g., using fetch or AJAX
    // Replace the following line with your data retrieval code
    fetch('https://www.foxnews.com/live-news/hamas-attack-israel-war')
      .then(response => response.text())
      .then(data => {
        // Update the content of the #content-container with the fetched data
        document.getElementById('content-container').innerHTML = data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });