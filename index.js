const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4004;

const cors = require('cors');
app.use(cors());

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/data', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const jsonData = JSON.parse(data);
    
        // Extract the name and age values from each object
        const output = jsonData.map((entry) => {
          const name = entry.name;
          const age = entry.age;
          return `${name} ${age}`;
        });
    
        // Join the extracted values with a space separator
        const result = output.join(' ');
    
        // Send the result as the response
        res.send(result);
      }
    });
  });
  

app.get('/dog', (req, res) => {
  const filePath = path.join(__dirname, 'dog.jpg');
  fs.readFile(filePath, 'binary', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.write(data, 'binary');
      res.end();
    }
  });
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(data);
    }
  });
});

app.post('/submit', (req, res) => {
    const { name, age } = req.body;
    const jsonData = { name, age };
    const jsonString = JSON.stringify(jsonData) + '\n'; // Add a new line after each JSON entry
  
    const filePath = path.join(__dirname, 'data.json');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        let existingData = [];
        if (data) {
          existingData = JSON.parse(data);
        }
  
        existingData.push(jsonData);
  
        const updatedDataString = JSON.stringify(existingData) + '\n';
  
        fs.writeFile(filePath, updatedDataString, 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.redirect('/data');
          }
        });
      }
    });
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
