
import express from 'express';
import { addNewConversation, syncConversations } from '../controllers/conversations.controller';

const router = express.Router();

router.post('/new', addNewConversation); // (This is actually /auth POST route)
router.get('/sync', syncConversations);

export default router;
