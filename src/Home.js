import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export const Home = ({ roomId, newRoomHandler }) => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                height: '100px',
                justifyContent: 'space-around'
            }}>
                <Typography>Create new poll:</Typography>
                <Link onClick={() => newRoomHandler('https://movie-night-server.onrender.com/get-top100-imdb')} to={`/party/${roomId}`}>TOP 100 IMDb</Link>
                <Link onClick={() => newRoomHandler('https://movie-night-server.onrender.com/get-most-popular-imdb')} to={`/party/${roomId}`}>Most Popular IMDb</Link>
            </Box>
        </>
    );
}