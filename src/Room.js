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
import Link from '@mui/material/Link';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Room = ({ loading = true, onLoading, socket, isNewRoom }) => {
    const { roomId } = useParams();
    const [movies, updateMovies] = useState([]);
    const [open, setOpen] = useState(false);
    const [kickedMovie, updateKickedMovie] = useState();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isExpired, setIsExpired] = useState(false);
    const [serverError, setServerError] = useState();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected');
            setIsConnected(true);
        });

        socket.on('disconnect', (data) => {
            console.log('Disconnected', data);
            setIsConnected(false);
        });

        socket.on('send content', (data) => {
            updateMovies(data);
            console.log('Received the latest data', data.length);
            if (loading) {
                onLoading(false);
            }
        });

        if (!isNewRoom) {
            socket.on('room expired', () => {
                setIsExpired(true);
                console.log('Room expired!');
            });
        }

        socket.on('list updated', (title) => {
            updateKickedMovie(title);
            setOpen(true);
            console.log('List updated, movie kicked:', title);
        });

        socket.emit('connected', roomId);
        console.log('Emitted joining the room', roomId);

        socket.emit('requested content', roomId);
        console.log('Emitted request for content');

        socket.on("server error", (data) => {
            setServerError(data);
            console.log('Server error', data);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('send content');
            socket.off('list updated');
            socket.off('room expired');
        };
    }, [loading, socket, isConnected]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleDelete = (e) => {
        socket.emit('delete item', { roomId, movieId: e.target.id });
    };

    const url = window.location.href;

    return (
        <>
            <Box sx={{
                marginLeft: '16px',
                marginBottom: '16px',
            }}>
                <Box sx={{
                    display: 'inline-flex',
                    marginBottom: '16px'
                }}>
                    <Link sx={{ display: 'flex', alignItems: 'center' }} href="/"><ArrowBackIosIcon fontSize="small" color="primary" />Back to main page</Link>
                </Box>
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
            {
                !loading && movies.length > 0 && <Box sx={{ display: 'flex', marginLeft: '16px' }}>
                    <Typography sx={{
                        paddingRight: '8px'
                    }}>Movies left:</Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#1976d2',
                        color: 'white'
                    }}>
                        <Typography>{movies.length}</Typography>
                    </Box>
                </Box>
            }
            {loading && !isExpired && <Typography sx={{ padding: '16px' }} variant="h5">Loading movies...</Typography>}
            {serverError && <Typography sx={{ padding: '16px' }} variant="h5">{`Error: ${serverError}. Don't worry, you can always watch Zoolander.`}</Typography>}
            {loading && isExpired && movies.length === 0 && <Typography sx={{ padding: '16px' }} variant="h5">This poll is expired! Please create a new one.</Typography>}
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {`Someone kicked out`} <b>{kickedMovie}</b>
                </Alert>
            </Snackbar>
            {movies.length === 1 && <h3>Your movie for today:</h3>}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
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
                <Link target="_blank" href={`https://www.imdb.com/title/${id}`}>
                    <Typography variant="body2" component="div">
                        {title}
                    </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                    {rating}
                </Typography>
            </CardContent>
            <CardActions>
                {!isLast && <Button variant="contained" id={id} onClick={onDelete} size="large">KICK OUT</Button>}
            </CardActions>
        </Card >
    )
}