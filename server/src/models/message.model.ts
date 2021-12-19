import mongoose from 'mongoose';

interface MessageDocument extends mongoose.Document {
    message: string;
    name: string;
    timestamp: string;
    received: boolean;
}

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    },
    received: {
        type: Boolean,
        required: true,
    },
});

export default mongoose.model<MessageDocument>('messagecontents', messageSchema);