import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar, Button } from "@mui/material";

const BASE_URL = "http://localhost:8000";

function Post({ post, authToken, authTokenType, username }) {
  const [imageUrl, setImageUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState();

  useEffect(() => {
    if (post.image_url_type === "absolute") {
      setImageUrl(post.image_url);
    } else {
      setImageUrl(BASE_URL + "/" + post.image_url);
    }
  }, []);

  useEffect(() => {
    setComments(post.comments);
  }, []);

  const handleDelete = (event) => {
    // event?.preventDefault();

    const requestOption = {
      headers: {
        Authorization: authTokenType + " " + authToken,
      },
    };
    fetch(BASE_URL + "/post/delete/" + post.id, requestOption)
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        }
        throw response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const postComment = (event) => {
    event?.preventDefault();
    const jsonString = JSON.stringify({
      username: username,
      text: newComment,
      post_id: post.id,
    });
    const requestOption = {
      method: "POST",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
        "Content-Type": "application/json",
      }),
      body: jsonString,
    };

    fetch(BASE_URL + "/comment", requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setNewComment("");
      });
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar alt={post.user.username} src="" />
        <div className="post_headerInfo">
          <h3>{post.user.username}</h3>
          <Button className="post_delete" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <img className="post_image" src={imageUrl} alt="" />
      <h4 className="post_text">{post.caption}</h4>
      <div className="post_comments">
        {comments.map((comment, idx) => (
          <p key={comment.id || idx}>
            <strong>{comment.username}:</strong> {comment.text}
          </p>
        ))}
      </div>
      {authToken && (
        <form className="post_commentbox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
          <button
            className="post_button"
            type="submit"
            disabled={!newComment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
