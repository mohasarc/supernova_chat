import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { DonutLarge, Chat, MoreVert, Add, Close, SearchOutlined, Start } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import SidebarChat from './SidebarChat'
import {User} from '../../App'
import PopupDialog from './PopupDialog'
import SearchContact from './SearchContact'
import { StateManager } from '../../utils/StateManager'
import { Actions } from '../../utils/consts'
import Pusher from 'pusher-js';
import axios from '../../axios';
import { Conversation } from '../../App';
import { AvatarGenerator } from 'random-avatar-generator';
const generator = new AvatarGenerator();

function Sidebar() {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [user, setUser] = useState<User>(StateManager.getInstance().getState(Actions.authUser) || {});
    const [canCreateConv, setCanCreateConv] = useState<boolean>(false);
    const [needTitle, setNeedTitle] = useState<boolean>(false);
    const [convTitle, setConvTitle] = useState<string>('new Conversation');
    const [allConvs, setAllConvs] = useState<Conversation[]>(StateManager.getInstance().getState(Actions.allConvs) || []);

    StateManager.getInstance().subscribe(Actions.authUser, () => {
        setUser(StateManager.getInstance().getState(Actions.authUser));
    });
    
    StateManager.getInstance().subscribe(Actions.selectedContacts, () => {
        const selectedContacts = StateManager.getInstance().getState(Actions.selectedContacts);
        setCanCreateConv(selectedContacts.length > 0);
        setNeedTitle(selectedContacts.length > 0);
    });

    StateManager.getInstance().subscribe(Actions.allConvs, () => {
        console.log('SIDEBAR: all conversations array updated!!');
        setAllConvs(StateManager.getInstance().getState(Actions.allConvs));
    });
    
    const handleSelectingRoom = (roomId: string) => {
        StateManager.getInstance().setState(Actions.selectedConv, roomId);
    }
    
    const handleConversationCreation = async () => {
        const selectedContacts: User[] = StateManager.getInstance().getState(Actions.selectedContacts);
        console.log('creating a new conv');
        let theConvTitle = convTitle;
        let convAvatar = generator.generateRandomAvatar(convTitle);

        if (selectedContacts.length === 1) {
            // theConvTitle = selectedContacts[0].name;
            // convAvatar = selectedContacts[0].avatar;
        }

        await axios.post('/api/v1/conversations/new', {
            convTitle: theConvTitle,
            convAvatar,
            participants_ids: [...selectedContacts.map((c: User) => c._id), user._id]
        });

        setOpenDialog(false);
    }
    
    // useEffect(() => {
        // const pusher = new Pusher('c46e65cf878ec00f5f7a', {
        //     cluster: 'eu'
        // });

        // const channel = pusher.subscribe('conversations');
        // channel.bind('inserted', function (data: Conversation) {
        //     console.log('something inserted!');
        //     setAllConvs([...allConvs, data]);
        // });

        // return () => {
        //     channel.unbind_all();
        //     channel.unsubscribe();
        // }
    // }, [allConvs]);

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
                {allConvs.map(conv => <SidebarChat avatar={conv.convAvatar} selectRoom={handleSelectingRoom} roomName={conv.convTitle} lastMessage={conv.lastMessage} conv_id={conv._id}/>)}
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
