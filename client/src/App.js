import { useEffect, useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/sidebar/Sidebar';
import Pusher from 'pusher-js';

import axios from './axios';

function App() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/messages/sync')
        .then(res => {
            console.log(res.data);
            setMessages(res.data);
        })
        .catch();
    })

    useEffect(() => {
        const pusher = new Pusher('c46e65cf878ec00f5f7a', {
            cluster: 'eu'
          });
      
          const channel = pusher.subscribe('messages');
          channel.bind('inserted', function(data) {
            // alert(JSON.stringify(data));
            setMessages([...messages, data]);
          });
        
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [messages]);
    
    return (
        <div className='app'>
            <div className='app__body'>
                <Sidebar />
                <Chat messages={messages}/>
            </div>
        </div>
    );
}

export default App;