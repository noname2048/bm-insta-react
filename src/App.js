import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import logo from "./instagram-logo.png";
import { Button, Modal, Input, Box } from "@mui/material";
// import { makeStyles } from "@mui/styles";

const BASE_URL = "http://localhost:8000";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     backgroundColor: theme.palette.background.paper,
//     position: "absolute",
//     width: 400,
//     border: "2px solid #000",
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
// }));

function App() {
  // const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "/post/all")
      .then((response) => {
        const json = response.json();
        console.log(json);
        if (response.ok) {
          return json;
        }
        throw response;
      })
      .then((data) => {
        const result = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(
            Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5])
          );
          const d_b = new Date(
            Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5])
          );
          return d_b - d_a;
        });
        return result;
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }, []);

  const signIn = (event) => {};

  return (
    <div className="app">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box
          style={modalStyle}
          sx={{
            bgcolor: "background.paper",
            position: "absolute",
            width: "400px",
            border: "2px solid #000",
            boxShadow: (theme) => theme.shadows[5],
            padding: (theme) => theme.spacing(2, 4, 3),
          }}
        >
          <form className="app_signin">
            <center>
              <img src={logo} alt="Instagram" className="app_headerImage" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Login
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="app_header">
        <img src={logo} alt="Instagram" className="app_headerImage" />
        <div>
          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
        </div>
      </div>

      <div className="app_posts">
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
