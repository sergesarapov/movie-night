import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { ENDPOINT } from './App';

export const Home = ({ roomId, newRoomHandler }) => {
    return (
        <>
            <Box sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                padding: '16px',
                height: '100px',
                justifyContent: 'space-around'
            }}>
                <Typography>Create new poll:</Typography>
                <Link onClick={() => newRoomHandler(`${ENDPOINT}/get-top100-imdb`)} to={`/party/${roomId}`}>TOP 100 IMDb</Link>
                <Link onClick={() => newRoomHandler(`${ENDPOINT}/get-most-popular-imdb`)} to={`/party/${roomId}`}>Most Popular IMDb</Link>
                <Link onClick={() => newRoomHandler(`${ENDPOINT}/get-in-theaters-imdb`)} to={`/party/${roomId}`}>In Theaters IMDb</Link>
            </Box>
        </>
    );
}