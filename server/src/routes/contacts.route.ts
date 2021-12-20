
import express from 'express';
import { getContacts } from '../controllers/contacts.controller';

const router = express.Router();

router.get('/get', getContacts); // (This is actually /auth POST route)

export default router;
