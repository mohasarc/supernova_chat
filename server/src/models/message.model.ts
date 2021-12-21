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
    sender_id: {
        type: String,
        required: true,
    },
    sender_name: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    },
    conv_id: {
        type: String,
        required: true,
    }
});

export default mongoose.model<MessageDocument>('messagecontents', messageSchema);