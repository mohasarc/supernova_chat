import React from 'react'
import './PopupDialog.css'

interface PopupDialigProps {

}

function PopupDialog(props: React.PropsWithChildren<PopupDialigProps>) {
    return (
        <div className='popupbg'>
            <div className='popupdialog'>
                {props.children}
            </div>
        </div>
    )
}

export default PopupDialog;
