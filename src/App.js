import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Room } from './Room';
import { Home } from './Home';
import { v4 as uuid } from 'uuid';
import socketIOClient from "socket.io-client";
import { Typography } from '@mui/material';

const ENDPOINT = "https://movie-night-server.onrender.com";
const socket = socketIOClient(ENDPOINT);
const roomId = uuid();

export const App = () => {
    const [loading, setIsLoading] = useState(true);
    const [mainLoading, setIsMainLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetch('https://movie-night-server.onrender.com');
            if (resp.status === 200) {
                setIsMainLoading(false);
            }
        };
        fetchData();
    }, []);

    const onCreateNewRoom = async (api) => {
        const resp = await fetch(api);
        const movies = await resp.json();
        socket.emit('created room', { roomId, movies });
        console.log(`Room ${roomId} created. Requested data.`);
        setIsLoading(false);
    };

    return (
        <>
            <Typography variant="h2" sx={{
                marginLeft: '16px'
            }}>Movie Night</Typography>
            {mainLoading ? (
                <Typography sx={{ paddingLeft: '16px' }} variant='h6'>Starting the app...</Typography>
            ) : (<BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home roomId={roomId} newRoomHandler={onCreateNewRoom} />} />
                    <Route path={`/party/:roomId`} element={<Room loading={loading} onLoading={setIsLoading} socket={socket} />} />
                </Routes>
            </BrowserRouter>)}
        </>
    );
}