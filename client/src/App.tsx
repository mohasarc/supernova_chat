import { useEffect, useState } from 'react';
import React from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/sidebar/Sidebar';
import GoogleAuth from "./components/GoogleAuth";
import { StateManager } from './utils/StateManager';
import { Actions } from './utils/consts';
import Pusher from 'pusher-js';
import axios from './axios';

export interface Message {
    message: string,
    timestamp: string,
    sender_id: string,
    sender_name: string,
    conv_id: string,
}

export interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface Conversation {
    _id: string,
    convTitle: string,
    participants_id: string[],
    lastMessage: string,
}

function App() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [convId, setConvId] = useState<string>(StateManager.getInstance().getState(Actions.selectedConv) || '')
    const [user, setUser] = useState<User>(StateManager.getInstance().getState(Actions.authUser) || {});

    StateManager.getInstance().subscribe(Actions.loggedIn, () => {
        setLoggedIn(StateManager.getInstance().getState(Actions.loggedIn));
    });
    
    StateManager.getInstance().subscribe(Actions.selectedConv, () => {
        setConvId(StateManager.getInstance().getState(Actions.selectedConv));
    });

    StateManager.getInstance().subscribe(Actions.authUser, () => {
        console.log('\n\n\nSetting auth user: ', StateManager.getInstance().getState(Actions.authUser));
        setUser(StateManager.getInstance().getState(Actions.authUser));
    });
    
    const fetchConversations = () => {
        const authUser = StateManager.getInstance().getState(Actions.authUser);
        if (authUser?._id !== undefined) {
            console.log('retrieving convs!');
            axios.get('/api/v1/conversations/sync', { params: { user_id: authUser._id } })
                .then(res =>{
                    console.log('retrieved all convs:', res.data);
                    StateManager.getInstance().setState(Actions.allConvs, [...res.data]);
                })
                .catch((err) => {
                    console.warn('failed to retrieve convs: ', err);
                });
        } else {
            console.warn('USER IS UNDEFINED, Failed to retrieve convs')
        }
    }
    
    const fetchMessages = () => {
        console.log('fetching messages');
        const conv_id = StateManager.getInstance().getState(Actions.selectedConv);
        if (conv_id !== undefined) {
            axios.get('/api/v1/messages/sync', { params: { conv_id } })
                .then(res => {
                    const oldMessages = StateManager.getInstance().getState(Actions.messages);
                    StateManager.getInstance().setState(Actions.messages, { ...oldMessages, [conv_id]: [...res.data]});
                });
        }
    }
    
    StateManager.getInstance().subscribe(Actions.selectedConv, () => {
        fetchMessages();
    });

    useEffect(() => {
        const pusher = new Pusher('c46e65cf878ec00f5f7a', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('messages');
        channel.bind('inserted', function (data: Message) {
            fetchMessages();
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, []);
 
    useEffect(() => {
        console.log('the user id: ', user._id);
        fetchConversations();
    }, [user]);
    
    useEffect(() => {
        const pusher = new Pusher('c46e65cf878ec00f5f7a', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('conversations');
        channel.bind('inserted|updated', function () {
            console.log('pusher notified me about conv change!');
            fetchConversations();
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, []);

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