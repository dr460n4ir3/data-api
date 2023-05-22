fetch('http://localhost:4004/data')
        .then(response => response.text())
        .then(data => {
          document.getElementById('data').textContent = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });