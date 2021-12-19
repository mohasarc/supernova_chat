import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/messages.route';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

/*
* App Config
*/
const app = express();
const PORT = 3001 || process.env.PORT;

const pusher = new Pusher({
    appId: '1319421',
    key: 'c46e65cf878ec00f5f7a',
    secret: '997eaeac9452c097424a',
    cluster: 'eu',
    useTLS: true
});

/*
* DB Config
*/
mongoose.connect(`${process.env.MONGO_URI}`);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
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
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);

/*
* End points 
*/
app.get('/', (req, res) => {
    res.status(200).send('hello world');
});

/*
* Start server
*/
app.listen(PORT, () => {
    console.log('Server started and listening to port: ', PORT);
})