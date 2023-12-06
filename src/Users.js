import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "./AuthenticationContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";

function UsersList() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
    },
  });

  const [listOfUsers, setListOfUsers] = useState([]);
  const { authState } = useContext(AuthenticationContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
          .get("http://localhost:8081/user-auth", {
            headers: { accessToken: localStorage.getItem("accessToken") },
          })
          .then((response) => {
            setListOfUsers(response.data);
          });
    }
  }, [navigate]);

  const deleteUser = (userId) => {
    axios
        .delete(`http://localhost:8081/user-auth/${userId}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then(() => {
          const updatedUsers = listOfUsers.filter((user) => user.id !== userId);
          setListOfUsers(updatedUsers);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="channelsList">
          <h2>All Users</h2>
          <List>
            {listOfUsers.map((value, key) => (
                <ListItem sx={{
                    width: '20%',
                    backgroundColor:  '#90caf9',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        'boxShadow': '0px 0px 15px rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-5px)',
                    }
                }} key={key}>
                  <ListItemText>
                    <Link style={{color: 'black'}} to={`/profile/${value.id}`}>{value.email}</Link>
                  </ListItemText>
                  {authState.email === "admin@admin.com" && (
                      <Button
                          variant="outlined"
                          onClick={() => deleteUser(value.id)}
                      >
                        Delete User
                      </Button>
                  )}
                </ListItem>
            ))}
          </List>
        </div>
      </ThemeProvider>
  );
}

export default UsersList;