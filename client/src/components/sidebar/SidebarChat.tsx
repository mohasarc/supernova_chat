import React from 'react'
import { Avatar } from '@material-ui/core'
import './SidebarChat.css'

interface SidebarChatInterface {
    selectRoom?: Function,
    roomName: string,
    lastMessage: string,
    roomId: string,
}

function SidebarChat({selectRoom, roomName, lastMessage, roomId}: SidebarChatInterface) {
    return (
        <div className='sidebarChat' onClick={() => {if (selectRoom) selectRoom(roomId)}}>
            <Avatar />
            <div className='sidebarChat__info'>
                <h2>{roomName}</h2>
                <p>{lastMessage}</p>
            </div>
        </div>
    )
}

export default SidebarChat
