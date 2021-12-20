import { Avatar, IconButton } from '@mui/material'
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon, Mic } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js';
import './Chat.css'
import axios from '../axios';
import { User, Message } from '../App';
import { StateManager } from '../utils/StateManager';
import { Actions } from '../utils/consts';

function Chat() {
    const [input, setInput] = useState('');
    const [convId, setConvId] = useState<string>(StateManager.getInstance().getState(Actions.selectedConv) || '')
    const [messages, setMessages] = useState<Message[]>(StateManager.getInstance().getState(Actions.convs+convId)?.messages || []);
    const [user, setUser] = useState<User>(StateManager.getInstance().getState(Actions.authUser) || {});
    
    StateManager.getInstance().subscribe(Actions.authUser, () => {
        setUser(StateManager.getInstance().getState(Actions.authUser));
    });

    StateManager.getInstance().subscribe(Actions.convs+convId, () => {
        setMessages(StateManager.getInstance().getState(Actions.convs+convId)?.messages || messages);
    });

    StateManager.getInstance().subscribe(Actions.selectedConv, () => {
        setConvId(StateManager.getInstance().getState(Actions.selectedConv));
    });

    useEffect(() => {
        axios.get('/api/v1/messages/sync', { params: { room_id: convId } })
            .then(res => {
                const conv = StateManager.getInstance().getState(Actions.convs+convId);
                StateManager.getInstance().setState(Actions.convs+convId, {...conv, messages: [...res.data]});
            })
    }, [convId]);

    useEffect(() => {
        const pusher = new Pusher('c46e65cf878ec00f5f7a', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('messages');
        channel.bind('inserted', function (data: Message) {
            console.log('something inserted!');
            setMessages([...messages, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [messages]);

    const sendMessage = async (e: any) => {
        e.preventDefault();

        await axios.post('/api/v1/messages/new', {
            message: input,
            sender_id: user._id,
            sender_name: user.name,
            room_id: convId,
            timestamp: (new Date()).toString(),
        });

        setInput('');
    }

    return (
        <div className='chat'>
            <div className='chat__header'>
                <Avatar />
                <div className='chat__headerInfo'>
                    <h3>Room Name{'-' + convId}</h3>
                    <p>last seen at ...</p>
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
