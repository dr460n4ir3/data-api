window.addEventListener('DOMContentLoaded', () => {
    const dataElement = document.getElementById('data');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:4004');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          dataElement.innerText = xhr.responseText;
        } else {
          console.error('Error:', xhr.status);
          dataElement.innerText = 'Error fetching data';
        }
      }
    };
    xhr.send();
  });
  