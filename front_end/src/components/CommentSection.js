import React, { useState, useEffect, useCallback, useContext } from "react";
import AddCommentModal from "./AddCommentModal";
import DataContext from "../DataContext";
import Axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import "../style/comment.css";

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
