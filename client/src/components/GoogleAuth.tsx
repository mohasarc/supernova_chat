import React from 'react'
import { useState } from "react";
import { AxiosResponse } from "axios";
import axios from '../axios'
import GoogleLogin from "react-google-login";

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

const GoogleAuth = ({setUser: setTheUser, setLoggedIn}:{setUser: Function, setLoggedIn: Function}) => {
    const [user, setUser] = useState<User | null>(null);
    const onSuccess = async (res: any) => {
        console.log('on success triggered!');
        try {
            const result: AxiosResponse<AuthResponse> = await axios.post("/auth/", {
                token: res?.tokenId,
            });

            setUser(result.data.user);
            setTheUser(result.data.user);
            setLoggedIn(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center flex-col">
            <div>
                {!user && (
                    <GoogleLogin
                        clientId={`${process.env.REACT_APP_CLIENT_ID}`}
                        onSuccess={onSuccess}
                        onFailure={(err) => {console.log('auth failed: ', err)}}
                    />
                )}

                {/* {user && (
                    <>
                        <img alt='user avatar' src={user.avatar} className="rounded-full" />
                        <h1 className="text-xl font-semibold text-center my-5">
                            {user.name}
                        </h1>
                    </>
                )} */}
            </div>
        </div>
    );
};

export default GoogleAuth;