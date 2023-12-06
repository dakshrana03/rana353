import React, {useEffect, useState, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import Reply from "../Reply";
import ReactHtmlParser from 'react-html-parser';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    CssBaseline,
    createTheme,
    Container,
    ThemeProvider,
    TextField,
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {quillStyles, modules, formats} from "./Helper";

function Question() {
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
            h1: {
                fontSize: '2rem',
            },
            h2: {
                fontSize: '1.8rem',
            },
            h3: {
                fontSize: '1.5rem',
            },
            h4: {
                fontSize: '1.2rem',
            },
            h5: {
                fontSize: '1rem',
            },
            h6: {
                fontSize: '1rem',
            },
            body1: {
                fontSize: '1rem',
            },
            body2: {
                fontSize: '0.875rem',
            },
            caption: {
                fontSize: '0.75rem',
            },
        },
    });

    const [canEdit, setCanEdit] = useState(false);
    let {id} = useParams();
    const [questionObject, setQuestionObject] = useState({});
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");
    const {authState} = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/questions/by-id/${id}`).then((response) => {
            setQuestionObject(response.data);
        });
        axios.get(`http://localhost:8081/replies/${id}`).then((response) => {
            setReplies(response.data);
        });
    }, []);

    const deleteQuestion = (id) => {
        axios
            .delete(`http://localhost:8081/questions/${id}`, {
                headers: {accessToken: localStorage.getItem("accessToken")},
            })
            .then(() => {
                navigate("/");
            });
    };

    function editNewTopicOnServer() {
        axios.put(
            "http://localhost:8081/questions/topic",
            {
                topic: questionObject.topic,
                id: id,
            },
            {
                headers: {accessToken: localStorage.getItem("accessToken")},
            }
        ).then(r => console.log(r.status));
    }

    function editNewQuestionOnServer() {
        axios.put(
            "http://localhost:8081/questions/question",
            {
                newText: questionObject.question,
                id: id,
            },
            {
                headers: {accessToken: localStorage.getItem("accessToken")},
            }
        );
    }

    function handleAddComment(event) {
        event.preventDefault();
        if (validateReply()) {
            axios
                .post(
                    "http://localhost:8081/replies",
                    {
                        body: newReply,
                        QuestionId: id,
                    },
                    {
                        headers: {
                            accessToken: localStorage.getItem("accessToken"),
                        },
                    }
                )
                .then((response) => {
                    if (response.data.error) {
                        console.log(response.data.error);
                    } else {
                        setReplies([
                            ...replies,
                            {
                                body: newReply,
                                email: response.data.email,
                            },
                        ]);
                        setNewReply("");
                    }
                });
        } else {
            console.log('Reply field validation failed');
        }
    }

    const deleteReply = (id) => {
        axios
            .delete(`http://localhost:8081/replies/${id}`, {
                headers: {accessToken: localStorage.getItem("accessToken")},
            })
            .then(() => {
                setReplies(
                    replies.filter((val) => {
                        return val.id !== id;
                    })
                );
            });
    };

    function validateReply() {
        let newErrors = {};
        if (!newReply) {
            newErrors = {...newErrors, comment: 'Reply field is Required'};
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container maxWidth="lg">
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '40px', marginBottom: '40px'}}>
                    <Typography component="h1" variant="h4" gutterBottom style={{marginBottom: '5px'}}>
                        Question Details
                    </Typography>
                    <Card sx={{
                        border: '1px solid white',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: "10px",
                        mb: '20px',
                    }}>
                        {canEdit ? (<TextField
                                label="Topic"
                                value={questionObject.topic}
                                margin="normal"
                                onChange={(e) => {
                                    setQuestionObject({...questionObject, topic: e.target.value});
                                }}
                                onBlur={() => {
                                    editNewTopicOnServer();
                                    setCanEdit(false);
                                }}
                            />)
                            :
                            (<CardHeader sx={{backgroundColor: "#90caf9"}} title={questionObject.topic}/>)}
                        <CardContent>
                            {canEdit ? (<ReactQuill
                                onChange={(value) => {
                                    setQuestionObject({...questionObject, question: value});
                                }}
                                onBlur={() => {
                                    editNewQuestionOnServer();
                                    setCanEdit(false);
                                }}
                                value={questionObject.question}
                                modules={modules}
                                formats={formats}
                                placeholder="Problem Description"
                                style={quillStyles}
                            />) : (<Typography sx={{width: "fit-content"}} variant="body">
                                {ReactHtmlParser(questionObject.question)}
                            </Typography>)}
                            <Typography variant="caption" color="text.secondary">
                                Question Rating: {questionObject.rating}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" sx={{width: "fit-content", backgroundColor: "#90caf9"}}>
                                <ThumbUpIcon style={{color: "black"}}/>
                            </Button>
                            <Button variant="outlined" sx={{width: "fit-content", backgroundColor: "#90caf9"}}>
                                <ThumbDownIcon sx={{color: "black"}}/>
                            </Button>
                            <Button variant="outlined" sx={{width: "fit-content", backgroundColor: "#90caf9"}}
                                    onClick={() => {
                                        if (authState.email === questionObject.email) {
                                            setCanEdit(!canEdit)
                                        }
                                    }}>
                                <EditIcon sx={{color: "black"}}/>
                            </Button>
                            <Button variant="outlined" sx={{width: "fit-content", backgroundColor: "#90caf9"}}
                                    onClick={() => {
                                        if (authState.email === questionObject.email) {
                                            deleteQuestion(questionObject.id);
                                        }
                                    }}>
                                <DeleteIcon sx={{color: "black"}}/>
                            </Button>
                        </CardActions>
                        <Typography variant="caption" color="text.secondary">
                            Post created by {questionObject.email}
                        </Typography>
                    </Card>
                    <div style={{width: 'fit-content'}}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Add Reply
                    </Typography>
                        <form onSubmit={(event) => handleAddComment(event)}>
                            <ReactQuill
                                value={newReply}
                                modules={modules}
                                formats={formats}
                                onChange={(value) => setNewReply(value)}
                                style={quillStyles}
                                placeholder="Reply"
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                                Add Reply
                            </Button>
                        </form>
                    </div>
                    <div className="listOfComments" style={{marginTop: '20px'}}>
                        {replies.map((comment, key) => {
                            return (
                                <Reply key={key} comment={comment} onDelete={deleteReply}/>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </ThemeProvider>
    );
}

export default Question;