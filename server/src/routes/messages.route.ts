import express, { Request, Response } from 'express';
import { addNewMessage, syncMessages } from '../controllers/messages.controller';
import { updateLatestMessage } from '../controllers/conversations.controller';

const router = express.Router();

router.post('/new', (req: Request, res: Response) => {
    updateLatestMessage(req, res);
    addNewMessage(req, res);
}); // (This is actually /auth POST route)
router.get('/sync', syncMessages)

export default router;
