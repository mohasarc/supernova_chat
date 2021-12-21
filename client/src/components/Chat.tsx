import { Avatar, IconButton } from '@mui/material'
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon, Mic } from '@mui/icons-material'
import React, { useState } from 'react'
import './Chat.css'
import axios from '../axios';
import { User, Message, Conversation } from '../App';
import { StateManager } from '../utils/StateManager';
import { Actions } from '../utils/consts';

function Chat() {
    const [input, setInput] = useState('');
    const [convId, setConvId] = useState<string>(StateManager.getInstance().getState(Actions.selectedConv) || '')
    const [messages, setMessages] = useState<Message[]>((StateManager.getInstance().getState(Actions.messages) || {})[convId] || []);
    const [user, setUser] = useState<User>(StateManager.getInstance().getState(Actions.authUser) || {});
    const [curConv, setCurConv] = useState<Conversation>((StateManager.getInstance().getState(Actions.allConvs) || []).find((c: Conversation) => c._id === convId) || []);
    
    StateManager.getInstance().subscribe(Actions.authUser, () => {
        setUser(StateManager.getInstance().getState(Actions.authUser));
    });

    StateManager.getInstance().subscribe(Actions.messages, () => {
        setMessages((StateManager.getInstance().getState(Actions.messages) || {})[convId] || messages);
    });

    StateManager.getInstance().subscribe(Actions.selectedConv, () => {
        const selectedConvId = StateManager.getInstance().getState(Actions.selectedConv);
        setCurConv((StateManager.getInstance().getState(Actions.allConvs)||[]).find((c: Conversation) => c._id === selectedConvId) || curConv)
        setConvId(selectedConvId);
    });

    const sendMessage = async (e: any) => {
        e.preventDefault();

        await axios.post('/api/v1/messages/new', {
            message: input,
            sender_id: user._id,
            sender_name: user.name,
            conv_id: convId,
            timestamp: (new Date()).toString(),
        });

        setInput('');
    }

    return (
        <div className='chat'>
            <div className='chat__header'>
                <Avatar />
                <div className='chat__headerInfo'>
                    <h3>{curConv.convTitle}</h3>
                    {/* <p>last seen at ...</p> */}
                </div>

                <div className='chat__headerRight'>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className='chat__body'>
                {messages.map((message: Message) => {
                    return (
                        <p className={`chat__message ${message.sender_id === user._id && 'chat__reciever'}`}>
                            <span className='chat__name'>{message.sender_name}</span>
                            {message.message}
                            <span className='chat__timestamp'> {message.timestamp} </span>
                        </p>
                    )
                })}
            </div>
            <div className='chat__footer'>
                <InsertEmoticon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder='Type a message' type='text' />
                    <button onClick={(e) => { sendMessage(e) }} type='submit' >Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat
