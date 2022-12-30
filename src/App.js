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
  const [loading, setIsLoading] = useState(false);
  const [mainLoading, setIsMainLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch('https://movie-night-server.onrender.com');
      if (resp.status === 200) {
        setIsMainLoading(false);
      }
    };
    fetchData();
  }, [])

  const onCreateNewRoom = async () => {
    setIsLoading(true);
    const resp = await fetch('https://raw.githubusercontent.com/sergesarapov/movie-night-api-mock/main/250.json');
    const response = await resp.json();
    const movies = response.items;
    movies.splice(100, 201);
    socket.emit('created room', { roomId, movies: movies });
    console.log(`Room ${roomId} created. Requested data.`);

    setIsLoading(false);
  }

  return (
    <>
      <Typography variant="h2" sx={{
        marginLeft: '16px'
      }}>Movie Night</Typography>
      {mainLoading ? (
        <Typography variant='h6'>Starting the app...</Typography>
      ) : (<BrowserRouter>
        <Routes>
          <Route path='/' element={<Home roomId={roomId} newRoomHandler={onCreateNewRoom} />} />
          <Route path={`/party/:roomId`} element={<Room loading={loading} socket={socket} />} />
        </Routes>
      </BrowserRouter>)}
    </>
  );
}