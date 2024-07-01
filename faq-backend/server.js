const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to get the FAQ data
app.get('/api/faq', (req, res) => {
    fs.readFile('faq.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading FAQ data');
        } else {
            res.send(JSON.parse(data));
        }
    });
});

// Endpoint to save the FAQ data
app.post('/api/faq', (req, res) => {
    const faqData = JSON.stringify(req.body, null, 2);
    fs.writeFile('faq.json', faqData, 'utf8', err => {
        if (err) {
            res.status(500).send('Error saving FAQ data');
        } else {
            res.send('FAQ data saved successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
