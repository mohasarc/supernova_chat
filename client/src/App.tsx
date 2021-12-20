import { useState } from 'react';
import React from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/sidebar/Sidebar';
import GoogleAuth from "./components/GoogleAuth";
import { StateManager } from './utils/StateManager';
import { Actions } from './utils/consts';

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
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [convId, setConvId] = useState<string>(StateManager.getInstance().getState(Actions.selectedConv) || '')
    StateManager.getInstance().subscribe(Actions.loggedIn, () => {
        setLoggedIn(StateManager.getInstance().getState(Actions.loggedIn));
    });
    StateManager.getInstance().subscribe(Actions.selectedConv, () => {
        setConvId(StateManager.getInstance().getState(Actions.selectedConv));
    });

    return (
        <div className='app'>
            <div className='app__body'>
                {!loggedIn && <GoogleAuth />}
                {loggedIn && <Sidebar/>}
                {convId !== '' && <Chat/>}
            </div>
        </div>
    );
}

export default App;