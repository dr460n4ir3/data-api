const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const mongodbURI = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(mongodbURI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`MongoDB is running on ${mongodbURI}`);
        });
    })
    .catch((err) => {
        console.log('Error connecting to DB', err);
        console.error(err);
    });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/', async (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');
    const { username, password } = await req.body;

    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        res.redirect('/home');
    } else {
        res.redirect('/');
        console.error('Wrong username or password');
    }
});

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

            // Join the entries with a newline character
            const result = output.join('\n');

            // Send the result as the response
            res.send(`${result}`);
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

app.get('/home', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'home.html');
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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*// Tickets array to simulate a database
let tickets = [];
let ticketId = 1;

// Create a ticket
app.post('/tickets', (req, res) => {
  const { name, email, phone, message, priority } = req.body;
  const ticket = { id: ticketId++, name, email, phone, message, priority };
  tickets.push(ticket);
  res.status(201).json(ticket);
});

// Read all tickets
app.get('/tickets', (req, res) => {
  res.json(tickets);
});

// Read a specific ticket
app.get('/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find((ticket) => ticket.id === id);
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// Update a ticket
app.put('/tickets/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, phone, message, priority } = req.body;
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === id);
  if (ticketIndex !== -1) {
    tickets[ticketIndex] = { id, name, email, phone, message, priority };
    res.json(tickets[ticketIndex]);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// Delete a ticket
app.delete('/tickets/:id', (req, res) => {
  const id = req.params.id;
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === id);
  if (ticketIndex !== -1) {
    const deletedTicket = tickets[ticketIndex];
    tickets.splice(ticketIndex, 1);
    res.json(deletedTicket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});*/

// Ticket schema
const ticketSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  priority: String,
});

// Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Create a ticket
app.post('/tickets', (req, res) => {
  const { name, email, phone, message, priority } = req.body;
  const ticket = new Ticket({ name, email, phone, message, priority });
  ticket.save()
    .then(savedTicket => {
      res.status(201).json(savedTicket);
    })
    .catch(error => {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Read all tickets
app.get('/tickets', (req, res) => {
  Ticket.find()
    .then(tickets => {
      res.json(tickets);
    })
    .catch(error => {
      console.error('Error retrieving tickets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Read a specific ticket
app.get('/tickets/:id', (req, res) => {
  const id = req.params.id;
  Ticket.findById(id)
    .then(ticket => {
      if (ticket) {
        res.json(ticket);
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      console.error('Error retrieving ticket:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
