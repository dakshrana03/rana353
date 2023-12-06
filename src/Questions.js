import React, {useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AuthenticationContext} from "./AuthenticationContext";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    createTheme,
    CssBaseline,
    InputAdornment,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ReactHtmlParser from "react-html-parser";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

axios.defaults.baseURL = "http://localhost:8081";

function AllQuestions() {
    const theme = createTheme({
        palette: {
            mode: "dark", primary: {
                main: "#90caf9",
            },
        },
    });

    const navigate = useNavigate();
    const {authState} = useContext(AuthenticationContext);
    const [questions, setQuestions] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            axios
                .get("/questions", {
                    headers: {accessToken: localStorage.getItem("accessToken")},
                })
                .then((response) => {
                    setQuestions(response.data.questions);
                });
        }
    }, [navigate, authState.status]);

    const filteredPosts = useMemo(() => {
        let result = questions;

        if (searchKey) {
            result = result.filter((post) => post.topic.toLowerCase().includes(searchKey.toLowerCase()) || post.question.toLowerCase().includes(searchKey.toLowerCase()));
        }

        if (searchUser) {
            result = result.filter((post) => post.email.toLowerCase().includes(searchUser.toLowerCase()));
        }

        return result;
    }, [searchKey, searchUser, questions]);

    const sortByMostLiked = () => {
        setQuestions([...questions].sort((a, b) => b.rating - a.rating));
    };

    const sortByDate = () => {
        setQuestions([...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    return (<ThemeProvider theme={theme}>
            <CssBaseline/>
            <div style={{margin: "20px"}}>
                <div
                    style={{
                        display: "flex", alignItems: "center", marginBottom: "20px",
                    }}
                >
                    <TextField
                        placeholder="Keyword"
                        variant="outlined"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>),
                        }}
                        sx={{mr: 2, width: 300}}
                    />
                    <TextField
                        placeholder="User"
                        variant="outlined"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                    <PersonIcon/>
                                </InputAdornment>),
                        }}
                        sx={{width: 300}}
                    />
                    <Typography variant="h5" component="div"
                                style={{marginLeft: '60px', marginRight: '20px', fontWeight: 'bold'}}>
                        Sort by:
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={sortByMostLiked}
                        sx={{marginLeft: 2}}
                    >
                        Most Liked
                    </Button>
                    <Button variant="contained" onClick={sortByDate} sx={{marginLeft: 2}}>
                        Date Created
                    </Button>
                </div>

                <h2>All Questions</h2>
                {filteredPosts.map((value) => (<Card
                        key={value.id}
                        onClick={() => {
                            navigate(`/question/${value.id}`);
                        }}
                        sx={{
                            border: '1px solid white',
                            borderRadius: '10px',
                            marginTop: '20px',
                            width: "fit-content",
                            display: 'flex',
                            flexDirection: 'column',
                            padding: "10px",
                            mb: '20px',
                        }}
                    >
                        <CardHeader sx={{color: 'black', backgroundColor: "#90caf9"}} title={value.topic}/>
                        <CardContent>
                            <Typography sx={{width: "fit-content"}} variant="body">
                                {ReactHtmlParser(value.question)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" sx={{width: "fit-content", backgroundColor: "#90caf9"}}>
                                <ThumbUpIcon style={{color: "black"}}/>
                            </Button>
                            <Button variant="outlined" sx={{width: "fit-content", backgroundColor: "#90caf9"}}>
                                <ThumbDownIcon sx={{color: "black"}}/>
                            </Button>
                        </CardActions>
                        <Typography sx={{marginLeft: "10px"}} variant="p" color="text.secondary">
                            Post Rating: {value.rating}
                        </Typography>
                    </Card>))}
            </div>
        </ThemeProvider>);
}

export default AllQuestions;
