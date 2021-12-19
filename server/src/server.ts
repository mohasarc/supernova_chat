import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import cors from 'cors';

import Messages from './dbMessages';

/*
* App Config
*/
const app = express();
const PORT = 3001 || process.env.PORT;

const pusher = new Pusher({
    appId: "1319421",
    key: "c46e65cf878ec00f5f7a",
    secret: "997eaeac9452c097424a",
    cluster: "eu",
    useTLS: true
});

/*
* DB Config
*/
const connection_url = 'mongodb+srv://mohasarc:ABCDEFGH@cluster0.xaosy.mongodb.net/supernovadb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connected');
    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();
    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            if (messageDetails !== undefined) {
                pusher.trigger('messages', 'inserted', {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    recieved: messageDetails.recieved,
                });
            }
        } else {
            console.error('Error triggering pusher');
        }
    })
});

/*
* Middleware
*/
app.use(express.json());
// app.use(cors);

// Look more into (problematic security-wise)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

/*
* End points 
*/
app.get('/', (req, res) => {
    res.status(200).send('hello world');
});

app.get('/api/v1/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(data);
    });
});

app.post('/api/v1/messages/new', (req, res) => {
    const dbMessage = req.body;

    console.log('creating new message');

    Messages.create(dbMessage, (err: any, data: any) => {
        if (err) res.status(500).send(err);
        else res.status(201).send(data); 
    });
});

app.listen(PORT, () => {
    console.log('Server started and listening to port: ', PORT);
})