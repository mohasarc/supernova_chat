import React, { useState } from 'react'
import { Avatar } from '@mui/material'
import './SidebarChat.css'
import { StateManager } from '../../utils/StateManager';
import { Actions } from '../../utils/consts';

interface SidebarChatInterface {
    selectRoom?: Function,
    roomName: string,
    lastMessage: string,
    conv_id: string,
    avatar: string,
}

function SidebarChat({selectRoom, roomName, lastMessage, conv_id, avatar}: SidebarChatInterface) {
    const [selected, setSelected] = useState<boolean>(false);

    StateManager.getInstance().subscribe(Actions.selectedConv, () => {
        const selectedConvId = StateManager.getInstance().getState(Actions.selectedConv);
        setSelected(selectedConvId === conv_id);
    });

    return (
        <div className={`sidebarChat ${selected && 'selected'}`} onClick={() => {if (selectRoom) selectRoom(conv_id)}}>
            <Avatar src={avatar}/>
            <div className='sidebarChat__info'>
                <h2>{roomName}</h2>
                <p>{lastMessage}</p>
            </div>
        </div>
    )
}

export default SidebarChat
