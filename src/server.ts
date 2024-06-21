import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbFilePath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send(true);
});

app.post('/submit', (req, res) => {
    console.log("Received submission request");
    const { name, email, phone, github_link, stopwatch_time } = req.body;
   
    console.log("Received data:", req.body);
  
    const submission = { name, email, phone, github_link, stopwatch_time };
    let submissions = [];

    if (fs.existsSync(dbFilePath)) {

        submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    }

    submissions.push(submission);

    try {
       
        fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
        console.log("Submission saved successfully");

        res.status(201).send(submission);
    } catch (error) {

        console.error('Error writing to db.json:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);

    if (isNaN(index)) {
        return res.status(400).send({ error: 'Invalid index' });
    }

    let submissions = [];

    if (fs.existsSync(dbFilePath)) {
        submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    }

    if (index < 0 || index >= submissions.length) {
        return res.status(404).send({ error: 'Submission not found' });
    }

    res.send(submissions[index]);
});


// Endpoint to update a submission by index
app.put('/update', (req, res) => {
    const index = parseInt(req.query.index as string, 10);

    if (isNaN(index)) {
        return res.status(400).send({ error: 'Invalid index' });
    }

    let submissions = [];

    if (fs.existsSync(dbFilePath)) {
        submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    }

    if (index < 0 || index >= submissions.length) {
        return res.status(404).send({ error: 'Submission not found' });
    }

    submissions[index] = req.body;

    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
        res.send('Submission updated');
    } catch (error) {
        console.error('Error writing to db.json:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a submission by index
app.delete('/delete', (req, res) => {
    const index = parseInt(req.query.index as string, 10);

    if (isNaN(index)) {
        return res.status(400).send({ error: 'Invalid index' });
    }

    let submissions = [];

    if (fs.existsSync(dbFilePath)) {
        submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    }

    if (index < 0 || index >= submissions.length) {
        return res.status(404).send({ error: 'Submission not found' });
    }

    submissions.splice(index, 1);

    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
        res.send('Submission deleted');
    } catch (error) {
        console.error('Error writing to db.json:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
