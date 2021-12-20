
import React from 'react'
import { Avatar } from '@mui/material'
import './Contact.css'

interface ContactProps {
    selectContact?: Function,
    name: string,
    contactId: string,
    avatarUrl: string,
    selected: boolean,
}

function Contact({selectContact, name, contactId, avatarUrl, selected}: ContactProps) {
    return (
        <div className={`contact ${selected && 'selected'}`} onClick={() => {if (selectContact) selectContact(contactId)}}>
            <Avatar src={avatarUrl} />
            <div className='contact__info'>
                <h2>{name}</h2>
            </div>
        </div>
    )
}

export default Contact
