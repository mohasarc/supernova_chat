import mongoose from "mongoose";

const messageContentSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

export default mongoose.model('messagecontents', messageContentSchema);