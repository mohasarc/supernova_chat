import React from 'react'
import './Sidebar.css'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Avatar, IconButton } from '@material-ui/core'
import { SearchOutlined } from '@material-ui/icons'
import SidebarChat from './SidebarChat'
import {User} from '../../App'

function Sidebar({user, setChatId}: {user: User, setChatId: Function}) {
    function handleSelectingRoom(roomId: string) {
        setChatId(roomId);
    }

    return (
        <div className='sidebar'>
            <div className='sidebar__header'>
                <Avatar src={user.avatar} />
                <div className='sidebar__headerRight'>
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className='sidebar__search'>
                <div className='sidebar__searchContainer'>
                    <SearchOutlined />
                    <input placeholder='Search or start a new chat' type='text'></input>
                </div>
            </div>
            <div className='sidebar__chats'>
                <SidebarChat selectRoom={handleSelectingRoom} roomName='welc' lastMessage='iiiiii' roomId='13ddas'/>
                <SidebarChat selectRoom={handleSelectingRoom} roomName='2ff' lastMessage='oh noo...' roomId='9234f'/>
                <SidebarChat selectRoom={handleSelectingRoom} roomName='hashx' lastMessage='kavvvv' roomId='42edg'/>
            </div>
        </div>
    )
}

export default Sidebar
