import { Request, Response } from 'express';
import User from '../models/user.model';

export const getContacts = async (req: Request, res: Response) => {
    const contactSearch: string = req.query.contact_name as string;
    
    let contacts = await User.find({name: new RegExp(contactSearch, 'i')});
    console.log('getting contacts, found data: ', contacts)

    res.json({ contacts });
};
