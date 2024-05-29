const configs = require('./config');
const env = process.env.NODE_ENV || 'development';
const { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USERNAME, COLLECTION_NAME, BACKEND_PORT } = configs[env]
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();
app.use(bodyParser.json());
const cors = require('cors');
const uri = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@cluster0.avkynxz.mongodb.net/`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.post('/api/uploadMessage', upload.single('audio'), async (req, res) => {
    const currentTime = new Date().toLocaleTimeString();
    req.body.time = currentTime;
    try {
        await client.connect();
        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);
        const patientId = req.body.patientId;
        const newAudio = {
            data: req?.file?.buffer,
            contentType: req?.file?.mimetype,
            date: req?.body?.date,
            time: req?.body?.time,
            patientId: req?.body?.patientId,
            text: req?.body?.text,
            mode: req?.body?.mode
        };
        await collection.insertOne(newAudio);
        const findResult = await collection.find({ patientId }).toArray();
        return res.json(findResult);
    } finally {
        await client.close();
    }
});

app.get('/api/data', async (req, res) => {
    console.log("calling get")
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const findResult = await collection.find({}).toArray();
    return res.json(findResult);
});
app.get('/api/data/message_list/:patientId', async (req, res) => {
    const patientId = req.params.patientId
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const findResult = await collection.find({ patientId }).toArray();
    res.json(findResult);
});

app.get('/api/data/patients', async (req, res) => {
    console.log("calling get patient")
    const database = client.db(DATABASE_NAME);
    const collection = database.collection('patients');
    const findResult = await collection.find({}).toArray();
    return res.json(findResult);

});

app.listen(BACKEND_PORT, () => {
    console.log('Server is running on port', BACKEND_PORT, DATABASE_NAME);
});
