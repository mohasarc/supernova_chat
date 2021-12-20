

import { Request, Response } from 'express';
import Conversation from '../models/conversation.model';

export const addNewConversation = async (req: Request, res: Response) => {
    console.log('creating new conv with :', req.body);
    const messagePayload = req.body;
    try {
        const conversation = await new Conversation(messagePayload);
        await conversation.save();
        console.log('New record saved to DB');
        res.status(201).send(conversation);
    } catch (err) {
        console.log('failed to save to DB: ', err);
        res.status(500).send(err);
    }
};

export const syncConversations = async (req: Request, res: Response) => {
    console.log('looking for convs of userID: ', req.query.user_id);
    if (req.query.user_id === undefined) {
        res.status(500).send();
        return;
    }

    Conversation.find({participants_ids: { "$in": [req.query.user_id] }}, (err, data) => {
    if (err) {
        console.log('an internal server error: ', err);
        res.status(500).send(err);
    } else {
        res.status(200).send(data);
    }
    });
}
