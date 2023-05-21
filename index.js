const express = require('express');
const fs = require('fs');
const app = express();
const port = 4004;

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    fs.readFile('data.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(data);
      }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);

