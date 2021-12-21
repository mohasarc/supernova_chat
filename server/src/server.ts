import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/messages.route';
import contactsRoutes from './routes/contacts.route';
import conversationRoutes from './routes/conversations.route';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

/*
* App Config
*/
const app = express();
const PORT = 3002 || process.env.PORT;

export const pusher = new Pusher({
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
    const cnvCollection = db.collection('conversations');
    const cnvChangeStream = cnvCollection.watch();
    const msgChangeStream = msgCollection.watch();
    msgChangeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            if (messageDetails !== undefined) {
                console.log('Pusher: some msg changed');
                pusher.trigger('messages', 'inserted', {
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    sender_id: messageDetails.sender_id,
                    sender_name: messageDetails.sender_name,
                    conv_id: messageDetails.conv_id,
                }).then((res) => {
                    console.log('Pusher finished work notofying msg change ');
                }).catch((err) => {
                    console.log('Err in pusher: ', err);
                });
            }
        } else {
            console.error('Error triggering pusher');
        }
    });

    cnvChangeStream.on('change', (change) => {
        // if (change.operationType === 'insert' || change.operationType === 'update') {
            const convDetails = change.fullDocument;
            if (convDetails !== undefined) {
                console.log('Pusher: some conv changed!!');
                pusher.trigger('conversations', 'inserted|updated', {
                    convTitle: convDetails.convTitle,
                    participants_ids: convDetails.participants_ids,
                }).then((res) => {
                    console.log('Pusher finished work notofying conv change');
                }).catch((err) => {
                    console.log('Err in pusher: ', err);
                });
            }
        // } else {
        //     console.error('Error triggering pusher');
        // }
    });
});

/*
* Middleware
*/
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/contacts', contactsRoutes);
app.use('/api/v1/conversations', conversationRoutes);

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