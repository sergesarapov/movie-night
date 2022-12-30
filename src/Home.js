import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

export const Home = ({ roomId, newRoomHandler }) => {

  return (
    <>
      <Box sx={{
        padding: '16px'
      }}>
        <Link onClick={newRoomHandler} to={`/movie-night/party/${roomId}`}>Create TOP100 IMDb roll</Link>
      </Box>
    </>
  );
}