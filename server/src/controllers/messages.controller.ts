
import { Request, Response } from 'express';
import Message from '../models/message.model';

export const addNewMessage = async (req: Request, res: Response) => {
    const messagePayload = req.body;
    try {
        const message = await new Message(messagePayload);
        await message.save();
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const syncMessages = async (req: Request, res: Response) => {
    // TODO will need to add a filter here not to fetch everything
    console.log('Req body value: ', req.query.room_id);
    Message.find({room_id: req.query.room_id}, (err, data) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(data);
    });
}
