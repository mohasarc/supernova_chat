import { Avatar, IconButton } from '@material-ui/core'
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon, Mic } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js';
import './Chat.css'
import axios from '../axios';
import { User, Message } from '../App';

function Chat({ chatId, user }: { chatId: string, user: User }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        axios.get('/api/v1/messages/sync', { params: { room_id: chatId } })
            .then(res => {
                setMessages([...res.data]);
            })
    }, [chatId]);

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
            room_id: chatId,
            timestamp: (new Date()).toString(),
        });

        setInput('');
    }

    return (
        <div className='chat'>
            <div className='chat__header'>
                <Avatar />
                <div className='chat__headerInfo'>
                    <h3>Room Name{'-' + chatId}</h3>
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
