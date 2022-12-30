import { useState, useEffect, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Room = ({ loading = false, socket }) => {
  const { roomId } = useParams();
  const [movies, updateMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [kickedMovie, updateKickedMovie] = useState();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    socket.emit('connected', roomId);
    socket.emit('requested content', roomId);
    socket.on('send content', (data) => {
      updateMovies(data);
    });
  }, [roomId, loading, socket]);

  useEffect(() => {
    socket.on('list updated', (title) => {
      updateKickedMovie(title);
      setOpen(true);
    });
  }, []);

  const handleDelete = (e) => {
    socket.emit('delete item', { roomId, movieId: e.target.id });
  }

  const url = window.location.href;

  return (
    <>
      <Box sx={{
        marginLeft: '16px',
        marginBottom: '32px'
      }}>
        <Typography variant="h6">Invite your friends using this link:</Typography>
        <TextField
          variant="outlined"
          readOnly
          sx={{
            width: '200px',
            height: '36.5px',
            marginRight: '8px',
            '& .MuiInputBase-input': {
              paddingTop: 0,
              paddingBottom: 0,
              height: '36px'
            }
          }}
          value={url}
          id="myInput"
        />
        <Button variant="outlined" onClick={() => navigator.clipboard.writeText(url)}>Copy link</Button>
      </Box>
      {loading && <Typography sx={{ padding: '16px' }} variant="h5">loading...</Typography>}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {`Someone kicked out`} <b>{kickedMovie}</b>
        </Alert>
      </Snackbar>
      {movies.length === 1 && <h3>Your movie for today:</h3>}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        // justifyContent: 'center',
        // alignItems: 'center',
        margin: '16px'
      }}>
        {movies.map((movie, i) => (
          <MovieItem key={i} title={movie.title} id={movie.id} image={movie.image} rating={movie.imDbRating} onDelete={handleDelete} isLast={movies.length === 1} />
        ))}
      </Box>
    </>)
}

const MovieItem = ({ title, rating, image, id, onDelete, isLast }) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: 155,
      height: 300,
      margin: '0 16px 16px 0'
    }}>
      <Box sx={{
        width: '100%',
        overflow: 'hidden'
      }}>
        <img width="100%" src={image} alt="poster" />
      </Box>
      <CardContent sx={{
        padding: '8px'
      }}>
        <Typography variant="body2" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {rating}
        </Typography>
      </CardContent>
      <CardActions>
        {!isLast && <Button variant="contained" id={id} onClick={onDelete} size="large">KICK OUT</Button>}
      </CardActions>
    </Card>
  )
}