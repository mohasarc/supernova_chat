import { Avatar, IconButton } from '@material-ui/core'
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon, Mic } from '@material-ui/icons'
import React from 'react'
import './Chat.css'

function Chat({ messages }) {
    return (
        <div className='chat'>
            <div className='chat__header'>
                <Avatar />
                <div className='chat__headerInfo'>
                    <h3>Room Name</h3>
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
                {messages.map((message) => {
                    return (
                        <p className={`chat__message ${message.received && 'chat__reciever'}`}>
                            <span className='chat__name'>{message.name}</span>
                            {message.message}
                            <span className='chat__timestamp'> {message.timestamp} </span>
                        </p>
                    )
                })}
            </div>
            <div className='chat__footer'>
                <InsertEmoticon />
                <form>
                    <input placeholder='Type a message' type='text'/>
                    <button type='submit' >Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat
