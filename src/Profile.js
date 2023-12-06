import React, {useEffect, useState, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import ReactHtmlParser from "react-html-parser";
import {
    Card,
    CardContent,
    Typography,
    Button,
    CssBaseline,
    createTheme,
    Container,
    ThemeProvider,
    CardHeader,
} from "@mui/material";

function Profile() {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9'
            },
        },
        typography: {
            fontSize: 14,
            htmlFontSize: 16,
            h3: {
                fontSize: '1.5rem',
            },
            h6: {
                fontSize: '1rem',
            }
        },
    });

    let {id} = useParams();
    let navigate = useNavigate();
    const [user, setUser] = useState({});
    const [listOfPosts, setListOfPosts] = useState([]);
    const {authState} = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:8081/user-auth/basic-info/${id}`).then((response) => {
            setUser(response.data);
        });

        axios.get(`http://localhost:8081/questions/by-user-id/${id}`).then((response) => {
            setListOfPosts(response.data);
        });
    }, [id]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container maxWidth="lg">
                <Typography variant="h3" component="div" style={{marginTop: '20px', fontWeight: 'bold'}}>
                    User Profile
                </Typography>
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '20px',
                        padding: '20px',
                        paddingRight: '50px',
                        width: 'fit-content'
                    }}
                >
                    <CardContent sx={{ borderRadius: '10px', border: '1px solid white', marginLeft: '40px', width: 'fit-content'}}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Name: {`${user.firstName} ${user.lastName}`}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Email: {user.email}
                        </Typography>
                        {authState.email === user.email && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    navigate("/change-password");
                                }}
                                style={{marginTop: '10px', padding: '5px', width: 'fit-content', height: 'fit-content'}}
                            >Change Password</Button>
                        )}
                    </CardContent>
                </Card>

                <div className="listOfPosts" style={{marginTop: '20px'}}>
                    <Typography variant="h3" component="div" style={{fontWeight: 'bold'}}>
                        User's Contributions
                    </Typography>
                    {listOfPosts.map((value, key) => (
                        <Card sx={{
                            border: '1px solid white',
                            borderRadius: '10px',
                            marginTop: '20px',
                            width: "28%",
                            display: 'flex',
                            flexDirection: 'column',
                            padding: "10px",
                            mb: '20px',
                        }}>
                            <CardHeader sx={{backgroundColor: "#90caf9"}} title={value.topic}/>
                            <CardContent>
                                <Typography sx={{width: "fit-content"}} variant="body">
                                    {ReactHtmlParser(value.question)}
                                </Typography>
                            </CardContent>
                            <Typography sx={{marginLeft: "10px"}} variant="p" color="text.secondary">
                                Post Rating: {value.rating}
                            </Typography>
                        </Card>
                    ))}
                </div>
            </Container>
        </ThemeProvider>
    );
}

export default Profile;