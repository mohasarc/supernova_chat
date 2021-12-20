
import mongoose from 'mongoose';

interface ConversationDocument extends mongoose.Document {
    convTitle: string,
    participant_ids: string[],
}

const conversationSchema = new mongoose.Schema({
    convTitle: {
        type: String,
        required: true,
    },
    participants_ids: [{
        type: String,
    }],
});

export default mongoose.model<ConversationDocument>('conversations', conversationSchema);