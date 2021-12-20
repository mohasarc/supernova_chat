import React from 'react'
import { AxiosResponse } from "axios";
import axios from '../axios'
import GoogleLogin from "react-google-login";
import { StateManager } from '../utils/StateManager';
import { Actions } from '../utils/consts';

console.log('GoogleClient: ', process.env.REACT_APP_CLIENT_ID)

interface AuthResponse {
    token: string;
    user: User;
}

interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
}

const GoogleAuth = () => {
    const onSuccess = async (res: any) => {
        try {
            const result: AxiosResponse<AuthResponse> = await axios.post("/auth/", {
                token: res?.tokenId,
            });

            StateManager.getInstance().setState(Actions.loggedIn, true);
            StateManager.getInstance().setState(Actions.authUser, result.data.user);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center flex-col">
            <div>
                <GoogleLogin
                    clientId={`${process.env.REACT_APP_CLIENT_ID}`}
                    onSuccess={onSuccess}
                    onFailure={(err) => {console.log('auth failed: ', err)}}
                />
            </div>
        </div>
    );
};

export default GoogleAuth;