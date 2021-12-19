import express from 'express';
import { addNewMessage, syncMessages } from '../controllers/messages.controller';

const router = express.Router();

router.post('/new', addNewMessage); // (This is actually /auth POST route)
router.get('/sync', syncMessages)

export default router;
