import React, { useState } from 'react'
import './Sidebar.css'
import { DonutLarge, Chat, MoreVert, Add, Close, SearchOutlined, Start } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import SidebarChat from './SidebarChat'
import {User} from '../../App'
import PopupDialog from './PopupDialog'
import SearchContact from './SearchContact'
import { StateManager } from '../../utils/StateManager'
import { Actions } from '../../utils/consts'

function Sidebar() {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [user, setUser] = useState<User>(StateManager.getInstance().getState(Actions.authUser) || {});
    const [canCreateConv, setCanCreateConv] = useState<boolean>(false);
    const [needTitle, setNeedTitle] = useState<boolean>(false);
    const [convTitle, setConvTitle] = useState<string>('new Conversation');

    StateManager.getInstance().subscribe(Actions.authUser, () => {
        setUser(StateManager.getInstance().getState(Actions.authUser));
    });
    
    StateManager.getInstance().subscribe(Actions.selectedContacts, () => {
        const selectedContacts = StateManager.getInstance().getState(Actions.selectedContacts);
        setCanCreateConv(selectedContacts.length > 0);
        setNeedTitle(selectedContacts.length > 1);
    });
    
    const handleSelectingRoom = (roomId: string) => {
        StateManager.getInstance().setState(Actions.selectedConv, roomId);
    }
    
    const handleConversationCreation = () => {

    }

    return (
        <div className='sidebar'>
            <div className='sidebar__header'>
                <Avatar src={user.avatar} />
                <div className='sidebar__headerRight'>
                    <IconButton onClick={() => {setOpenDialog(true)}}>
                        <Add />
                    </IconButton>
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
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
            <div>
                {openDialog && <PopupDialog>
                    <IconButton className='topright' onClick={() => {setOpenDialog(false)}}>
                        <Close />
                    </IconButton>
                    <SearchContact />
                    {canCreateConv && <IconButton onClick={handleConversationCreation} className='submitbutton'>
                        <Start />
                    </IconButton>}
                    {needTitle && <input value={convTitle} onChange={(e) => setConvTitle(e.target.value)} className='convname' placeholder='Please specify the conversation name'></input>}
                </PopupDialog>}
            </div>
        </div>
    )
}

export default Sidebar
