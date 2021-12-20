import { useEffect, useState } from 'react';
import React from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/sidebar/Sidebar';
import GoogleAuth from "./components/GoogleAuth";

import axios from './axios';

export interface Message {
    message: string,
    timestamp: string,
    sender_id: string,
    sender_name: string,
    room_id: string,
}

export interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
}

function App() {
    const [user, setUser] = useState<User>({_id: '0', name: 'user', email: 'abc@def.ghi', avatar:''});
    const [loggedIn, SetLoggedIn] = useState<boolean>(false);
    const [chatId, setChatId] = useState<string>('');

    return (
        <div className='app'>
            <div className='app__body'>
                {!loggedIn && <GoogleAuth setUser={setUser} setLoggedIn={SetLoggedIn} />}
                {loggedIn && <Sidebar user={user} setChatId={setChatId}/>}
                {chatId !== '' && <Chat chatId={chatId} user={user}/>}
            </div>
        </div>
    );
}

export default App;