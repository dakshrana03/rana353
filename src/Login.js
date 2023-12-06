import React, {useContext, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Alert, createTheme, CssBaseline, Snackbar, ThemeProvider, Typography} from "@mui/material";
import {AuthContext} from "../helpers/AuthContext";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9'
            },
        }
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuthState } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors = { ...newErrors, email: 'Please enter a valid email address' };
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            axios.post("http://localhost:8081/user-auth/login", formData).then((response) => {
                if (response.data.error) {
                    setErrorMessage(response.data.error);
                    setSnackbarOpen(true);
                } else {
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({
                        email: response.data.email,
                        id: response.data.id,
                        status: true,
                    });
                    navigate("/");
                }
                setFormData({
                    email: "",
                    password: ""
                });
            });
        } else {
            console.log('Form validation failed');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '64px' }}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                            Login
                        </Button>
                        <ErrorSnackbar open={snackbarOpen} handleClose={handleSnackbarClose} message={errorMessage}/>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    );
};

function ErrorSnackbar({ open, handleClose, message }) {
    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert elevation={6} variant="filled" severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}


export default Login;