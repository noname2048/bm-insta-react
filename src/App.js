import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import logo from "./instagram-logo.png";
import { Button, Modal, Input, Box } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import ImageUpload from "./ImageUpload";

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
  const [username, setUsername] = useState(
    () => window.localStorage.getItem("username") ?? "",
  );
  const [password, setPassword] = useState("");

  const [authToken, setAuthToken] = useState(
    window.localStorage.getItem("authToken"),
  );
  const [authTokenType, setAuthTokenType] = useState(
    window.localStorage.getItem("authTokenType"),
  );
  const [userId, setUserId] = useState(window.localStorage.getItem("userId"));

  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "/post/all")
      .then((response) => {
        const json = response.json();
        // console.log(json);
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
            Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5]),
          );
          const d_b = new Date(
            Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5]),
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

  useEffect(() => {
    authToken
      ? window.localStorage.setItem("authToken", authToken)
      : window.localStorage.removeItem("authToken");

    authTokenType
      ? window.localStorage.setItem("authTokenType", authTokenType)
      : window.localStorage.removeItem("authTokenType");

    username
      ? window.localStorage.setItem("username", username)
      : window.localStorage.removeItem("username");

    userId
      ? window.localStorage.setItem("userId", userId)
      : window.localStorage.removeItem("userId");
  }, [authToken, authTokenType, userId]);

  const signIn = (event) => {
    console.log("signin submit");
    event?.preventDefault();

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const requestOption = {
      method: "POST",
      body: formData,
    };
    fetch(BASE_URL + "/login", requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        // console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUsername(data.username);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

    setOpenSignIn(false);
  };

  const signOut = (event) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId("");
    setUsername("");
  };

  const signUp = (event) => {
    event.preventDefault();

    const jsonString = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });

    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonString,
    };

    fetch(BASE_URL + "/user", requestOption)
      .then((response) => {
        if (response.ok) return response.json();
        else {
          throw response;
        }
      })
      .then((data) => {
        // console.log(data);
        signIn();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

    setOpenSignUp(false);
  };

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
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
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
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign up
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="app_header">
        <img src={logo} alt="Instagram" className="app_headerImage" />
        {authToken ? (
          <Button onClick={() => signOut()}>Logout</Button>
        ) : (
          <div>
            <Button
              onClick={() => {
                setPassword("");
                setOpenSignIn(true);
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setUsername("");
                setEmail("");
                setPassword("");
                setOpenSignUp(true);
              }}
            >
              Signup
            </Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>

      {authToken ? <ImageUpload /> : <h3>you need to login to upload</h3>}
    </div>
  );
}

export default App;
