import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Container, createTheme, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function CreateChannel() {

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
        channelName: "",
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [navigate]);

    const validateForm = () => {
        let newErrors = {};
        if (!data.channelName) {
            newErrors = {...newErrors, channelName: 'Channel Name is Required'};
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', data);
            axios
                .post("http://localhost:8081/channels", data, { headers: { accessToken: localStorage.getItem("accessToken") } })
                .then((response) => { window.location.reload();});
            }
        else {
            console.log('Form validation failed');
        }
    };
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container component="main" maxWidth="xs">
                <div style={{ marginTop: '40px', marginBottom: '40px'}}>
                    <Typography component="h1" variant="h5" gutterBottom style={{marginBottom: '15px'}}>
                        Create Channel
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Channel Name"
                            name="channelName"
                            value={data.channelName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            error={Boolean(errors.channelName)}
                            helperText={errors.channelName}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                            Create Channel
                        </Button>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    );
}

export default CreateChannel