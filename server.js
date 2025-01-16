const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = './data.json';

// Load data from file
let data = [];
try {
    if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath);
        data = JSON.parse(fileData);
    }
} catch (error) {
    console.error('Error reading data file:', error);
}

// Save data to file
function saveData() {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data));
    } catch (error) {
        console.error('Error writing to data file:', error);
    }
}


// Create (POST)
app.post('/api/data', (req, res) => {
    const item = req.body;
    if (!item.id) {
        item.id = Date.now(); 
    }
    data.push(item);
    saveData(); // Save to file
    res.status(201).json(item);
});

// Read (GET)
app.get('/api/data', (req, res) => {
    res.json(data);
});

// Update (PUT)
app.put('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    let found = false;
    data = data.map(item => {
        if (item.id === id) {
            found = true;
            return updatedItem;
        }
        return item;
    });
    if (found) {
        saveData(); // Save to file
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete (DELETE)
app.delete('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = data.length;
    data = data.filter(item => item.id !== id);
    if (data.length !== initialLength) {
        saveData(); // Save to file
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Clear data on request
app.delete('/api/data', (req, res) => {
    data = []; // Reset the in-memory data
    saveData(); // Save the empty state to file
    res.status(204).end();
});


const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
