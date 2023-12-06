import React, {useEffect, useState} from "react";

import axios from "axios";
import {Container, createTheme, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import 'react-quill/dist/quill.snow.css'
import {modules, formats} from "./Helper";

function CreateQuestion({channelId}) {

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9'
            },
        }
    });
    const navigate = useNavigate();
    const [data, setData] = useState({
        topic: "",
        question: "",

    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [navigate]);

    const validateForm = () => {
        let newErrors = {};
        if (!data.topic) {
            newErrors = {...newErrors, topic: 'Topic field is Required'};
        }
        if (!data.question) {
            newErrors = {...newErrors, question: 'Question field is Required'};
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTopicChange = (event) => {
        const {name, value} = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuestionChange = (value) => {
        setData({
            topic: data.topic,
            question: value
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', data);
            axios
                .post(`http://localhost:8081/questions/${channelId}`, data,
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                )
                .then((response) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('Form validation failed');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container component="main">
                <div style={{marginTop: '40px', marginBottom: '40px'}}>
                    <Typography component="h1" variant="h5" gutterBottom style={{marginBottom: '15px'}}>
                        Create Question
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Topic"
                            name="topic"
                            value={data.topic}
                            onChange={handleTopicChange}
                            fullWidth
                            margin="normal"
                            error={Boolean(errors.topic)}
                            helperText={errors.topic}
                        />
                        <ReactQuill
                            onChange={handleQuestionChange}
                            modules={modules}
                            formats={formats}
                            style={{ height: '250px' }}
                            placeholder="Problem Description"
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '80px'}}>
                            Create Post
                        </Button>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    );
}

export default CreateQuestion;
