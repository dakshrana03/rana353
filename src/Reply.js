import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import ReactHtmlParser from 'react-html-parser';
import ReactQuill from "react-quill";
import {formats, modules, quillStyles} from "../pages/Helper";

const useStyles = makeStyles((theme) => ({
    comment: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
    },
    replies: {
        marginLeft: theme.spacing(2),
    },
    addReplyContainer: {
        marginTop: theme.spacing(2),
    },
}));

function Reply({ comment, onDelete }) {
    const classes = useStyles();
    const { authState } = useContext(AuthContext);
    let initialValue;
    if (comment.nestedReplies) {
        initialValue = comment.nestedReplies
    } else {
        initialValue = []
    }
    const [replies, setReplies] = useState(initialValue);
    const [newReply, setNewReply] = useState("");

    const addReply = () => {
        axios
            .post(
                "http://localhost:8081/replies",
                {
                    body: newReply,
                    QuestionId: comment.QuestionId,
                    parentId: comment.id,
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
                    const replyToAdd = {
                        body: newReply,
                        email: response.data.email,
                    };
                    setReplies([...replies, replyToAdd]);
                    setNewReply("");
                }
            });
        fetchReplies();
    };

    const deleteComment = (id) => {
        axios
            .delete(`http://localhost:8081/replies/${id}`, {
                headers: {accessToken: localStorage.getItem("accessToken")},
            })
            .then(() => {
                if (onDelete) {
                    onDelete(id);
                }
            });
        fetchReplies();
    };

    function fetchReplies() {
        axios
            .get(`http://localhost:8081/replies/${comment.id}`)
            .then((response) => {
                setReplies(response.data);
            });
    }

    return (
        <Card>
            <CardContent>
                <Typography>
                    <strong>{comment.email}:</strong> {ReactHtmlParser(comment.body)}
                </Typography>
                {authState.email === "admin@admin.com" && (
                    <Button onClick={() => deleteComment(comment.id)}>Delete</Button>
                )}
                <div className={classes.replies}>
                    {replies?.map((reply) => (
                        <Reply key={reply.id} comment={reply} onDelete={onDelete}/>
                    ))}
                </div>
                <div className={classes.addReplyContainer} style={{width: 'fit-content'}}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Add Reply
                    </Typography>
                    <form onSubmit={addReply}>
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
            </CardContent>
        </Card>
    );
}

export default Reply;