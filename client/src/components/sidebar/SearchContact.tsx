import { SearchOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { User } from '../../App';
import Contact from './Contact';
import './SearchContact.css';
import axios from '../../axios';
import { StateManager } from '../../utils/StateManager';
import { Actions } from '../../utils/consts';

function SearchContact() {
    const [foundContacts, setFoundContacts] = useState<User[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<User[]>(StateManager.getInstance().getState(Actions.selectedContacts) || []);
    const [searchValue, setSearchValue] = useState<string>('');
    const [user, setUser] = useState<User>(StateManager.getInstance().getState(Actions.authUser) || {});
    
    StateManager.getInstance().subscribe(Actions.authUser, () => {
        setUser(StateManager.getInstance().getState(Actions.authUser));
    });
    
    StateManager.getInstance().subscribe(Actions.selectedContacts, () => {
        setSelectedContacts(StateManager.getInstance().getState(Actions.selectedContacts));
    });

    useEffect(() => {
        handleContactSearch('');
    }, [])

    const handleContactSearch = (query: string) => {
        setSearchValue(query);
        axios.get('/api/v1/contacts/get', {params: {contact_name: query}})
            .then(res => {
                console.log('retrieved contacts', res.data);
                setFoundContacts([...(res.data.contacts.filter((contact:User) => contact._id !== user._id))]);
            });
    }
    
    const selectContact = (contactId: string) => {
        const selectedContact = foundContacts.find(contact => contact._id === contactId);
        if (!selectedContact) return;
        StateManager.getInstance().setState(Actions.selectedContacts, [...selectedContacts, selectedContact]);
    }

    const unselectContact = (contactId: string) => {
        const selectedContact = selectedContacts.find(contact => contact._id === contactId);
        if (!selectedContact) return;

        const selectedContactIndex = selectedContacts.indexOf(selectedContact);

        selectedContacts.splice(selectedContactIndex, 1)
        StateManager.getInstance().setState(Actions.selectedContacts, [...selectedContacts]);
    }

    return (
        <div>
            <div className='search'>
                <div className='searchContainer'>
                    <SearchOutlined />
                    <input value={searchValue} placeholder='Search or start a new chat' type='text' onChange={(e) => handleContactSearch(e.target.value)}></input>
                </div>
            </div>
            <div className='contacts'>
                {selectedContacts.map(contact => (
                    <Contact selected={true} selectContact={unselectContact} name={contact.name} contactId={contact._id} avatarUrl={contact.avatar}/>
                ))}
                {foundContacts.filter(contact => selectedContacts.find(c => c._id === contact._id) === undefined).map(contact => (
                    <Contact selected={false} selectContact={selectContact} name={contact.name} contactId={contact._id} avatarUrl={contact.avatar}/>
                ))}
            </div>
        </div>
    )
}

export default SearchContact
