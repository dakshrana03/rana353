import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {
    Avatar,
    Container,
    createTheme,
    CssBaseline, IconButton,
    List, ListItem, ListItemAvatar, ListItemText,
    ThemeProvider,
    Typography
} from '@mui/material';
import {AuthenticationContext} from './AuthenticationContext';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteIcon from "@mui/icons-material/Delete";

function ChannelsList() {
    const [channels, setChannels] = useState([]);
    const {authState} = useContext(AuthenticationContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
        } else {
            axios.get('http://localhost:8081/channels', {
                headers: {accessToken: localStorage.getItem('accessToken')},
            })
                .then((response) => {
                    setChannels(response.data);
                });
        }
    }, [navigate, authState.status]);

    const deleteChannel = (channelId) => {
        axios.delete(`http://localhost:8081/channels/${channelId}`, {
            headers: {accessToken: localStorage.getItem('accessToken')},
        })
            .then(() => {
                const updatedChannels = channels.filter((channel) => channel.id !== channelId);
                setChannels(updatedChannels);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container component="main" maxWidth="xs">
                <div style={{marginTop: '40px', marginBottom: '40px'}}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        List of Channels
                    </Typography>
                    <List sx={{width: 'fit-content'}} component="nav" aria-labelledby="nested-list-subheader">
                        {channels.map((value, key) => (
                            <ListItem
                                key={key}
                                style={{
                                    marginTop: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#90caf9',
                                    borderRadius: '5px'
                                }}
                                component={Link}
                                to={`/channel/${value.id}`}
                            >
                                <ListItemAvatar style={{color: 'black'}}>
                                    <Avatar style={{backgroundColor: 'white'}}>
                                        <ForumIcon style={{color: 'black'}}/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primaryTypographyProps={{fontWeight: 'bold', color: 'black'}}
                                    primary={value.channelName}
                                />
                                {authState.email === 'admin@admin.com' && (
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => deleteChannel(value.id)}
                                    >
                                        <DeleteIcon style={{color: 'black'}}/>
                                    </IconButton>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Container>
        </ThemeProvider>
    );
}

export default ChannelsList;