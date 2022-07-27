import React, { useState, useEffect, useCallback, useContext } from "react";

import AddCommentModal from "./AddCommentModal";
import DataContext from "../DataContext";
import Axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import "../style/comment.css";
import Button from "./Button";

export default function CommentSection({ postId }) {
  const { dataUser, LStoken } = useContext(DataContext);
  const [comments, setComments] = useState([]);
  const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const userId = dataUser.id;

  const fetchComments = useCallback(() => {
    Axios.get(`http://localhost:3000/api/comment/ofpost/${postId}`, {
      headers: {
        Authorization: LStoken,
      },
    }).then((response) => {
      setComments(response.data);
    });
  }, [LStoken]);

  const submitComment = useCallback(() => {
    console.log(LStoken);
    const userId = dataUser.id;
    const userName = dataUser.name;
    console.log(postId);
    console.log(userName);
    Axios.post(
      `http://localhost:3000/api/comment/${postId}`,
      {
        content: comment,
        userId: userId,
        userName: userName,
      },
      {
        headers: {
          Authorization: LStoken,
        },
      }
    );
    setIsOpenCommentModal(!isOpenCommentModal);
    // refresh page after submit
    window.location.reload();
    setComments([...comments, { comment: comment, userName: userName }]);
  }, [comment, postId]);

  const deleteComment = (id) => {
    console.log(id);
    Axios.delete(`http://localhost:3000/api/comment/${id}`, {
      headers: {
        Authorization: LStoken,
      },
    });

    const newComments = comments.filter((comment) => comment.id !== id);
    setComments(newComments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <div className="horizontal-bar"></div>
      <button
        className="add-comment-btn"
        onClick={() => setIsOpenCommentModal(true)}
      >
        COMMENTER
      </button>

      <AddCommentModal
        open={isOpenCommentModal}
        onClose={() => setIsOpenCommentModal(false)}
      >
        <textarea
          className="input-content"
          placeholder="Ajouter un commentaire"
          name="content"
          type="text"
          onChange={(e) => {
            setComment(e.target.value);
          }}
        ></textarea>
        <button className="submit-btn" onClick={submitComment}>
          PROPOSER
        </button>
      </AddCommentModal>

      <div className="comment-section">
        {comments.map((comment) => {
          return (
            <div className="comment-single">
              <div className="comment-inner-container">
                <p className="comment-of">
                  - Commentaire créé par {comment.userName} -
                </p>
                <p className="comment-text">{comment.content}</p>
              </div>

              {comment.userId === userId || dataUser.moderator === true ? (
                <FaTrashAlt
                  className="delete-comment-btn"
                  onClick={() => deleteComment(comment.id)}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}


const Post = (props) => {
  // Authentication context
  const auth = useContext(AuthContext);

  // Request Hook
  const { isLoading, sendRequest } = useHttpRequest();

  // History context
  const history = useHistory();

  // App Location
  const path = props.location.pathname;
  const postId = props.location.pathname.split("/")[2];

  // User Likes
  const [likesCounter, setLikesCounter] = useState(props.likes);

  // User Dislikes
  const [dislikesCounter, setDislikesCounter] = useState(props.dislikes);

  // User's reaction to post
  const [userReaction, setUserReaction] = useState(props.userReaction);

  // Reaction status
  const [hasReacted, setHasReacted] = useState(props.userReaction === null ? false : true);

  // Reaction Handler
  const userReactionHandler = (event) => {
    event.preventDefault();
    let reaction;

    switch (userReaction) {
      case null:
        if (event.currentTarget.name === "like") {
          setLikesCounter(likesCounter + 1);
          reaction = event.currentTarget.name;
        } else {
          setDislikesCounter(dislikesCounter + 1);
          reaction = event.currentTarget.name;
        }
        setUserReaction(event.currentTarget.name);
        setHasReacted(true);

        break;

      case "null":
        if (event.currentTarget.name === "like") {
          setLikesCounter(likesCounter + 1);
          reaction = event.currentTarget.name;
        } else {
          setDislikesCounter(dislikesCounter + 1);
          reaction = event.currentTarget.name;
        }
        setUserReaction(event.currentTarget.name);

        break;

      case "like":
        if (event.currentTarget.name === "like") {
          setLikesCounter(likesCounter - 1);
          setUserReaction("null");
          reaction = "null";
        } else {
          setLikesCounter(likesCounter - 1);
          setDislikesCounter(dislikesCounter + 1);
          setUserReaction(event.currentTarget.name);
          reaction = event.currentTarget.name;
        }

        break;

      case "dislike":
        if (event.currentTarget.name === "dislike") {
          setDislikesCounter(dislikesCounter - 1);
          setUserReaction("null");
          reaction = "null";
        } else {
          setLikesCounter(likesCounter + 1);
          setDislikesCounter(dislikesCounter - 1);
          setUserReaction(event.currentTarget.name);
          reaction = event.currentTarget.name;
        }

        break;

      default:
        console.log("an error was produced in userReactionHandler function on post component");
        break;
    }

    fetch(`${process.env.REACT_APP_API_URL}/posts/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
      body: JSON.stringify({
        post_id: props.id,
        reaction: reaction,
        reacted: hasReacted,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return;
        }
      })
      .catch((err) => console.log(err));
  };

  // Delete Post
  const DeletePostHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/posts/${props.id}`,
        "DELETE",
        JSON.stringify({ image_url: props.image_url }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      if (path === `/posts/${postId}`) {
        history.push(`/posts`);
      } else {
        props.onDelete(props.id);
      }
    } catch (err) { }
  };

  // Type de visualisation sur Posts et Comment Post
  let commentBlock;

  if (props.location.pathname === "/posts") {
    commentBlock = (
      <>
        <ReactionBtn btnType="decor" icon="comments" text={props.comments} styling="" reaction={null} />
        <ReactionBtn
          btnType="link"
          link={props.post_link}
          reaction={null}
          icon="comment"
          text="commenter"
          styling={styles.comment_btn}
        />
      </>
    );
  } else {
    commentBlock = (
      <ReactionBtn
        btnType="decor"
        icon="comments"
        text={props.comments}
        styling={styles.push_right}
        reaction={null}
      />
    );
  }

  return (
    <article id={props.post_id}>
      {isLoading && (
        <div className="spinner">
          <Spinner asOverlay />
        </div>
      )}
      <UserHeader
        user_id={props.user_id}
        photo_url={props.photo_url}
        firstName={props.firstName}
        lastName={props.lastName}
        date={props.date}
        category={props.category}
        onDelete={DeletePostHandler}
      />
      <section className={styles.block}>
        <h3 className={styles.title}>{props.title}</h3>
        <img className={styles.photo} src={props.image_url} alt="post" />
        <footer className={styles.reactions}>
          <Button
            btnType="functional"
            name="like"
            onReaction={userReactionHandler}
            reaction={userReaction === "like" ? "like" : null}
            icon="like"
            text={likesCounter}
            styling=""
          />
          <Button
            btnType="functional"
            name="dislike"
            onReaction={userReactionHandler}
            reaction={userReaction === "dislike" ? "dislike" : null}
            icon="dislike"
            text={dislikesCounter}
            styling=""
          />
          {commentBlock}
        </footer>
      </section>
    </article>
  );
};
