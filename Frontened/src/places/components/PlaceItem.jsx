import React, { useState, useEffect, useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";
import authContext from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { Link } from "react-router-dom";

const PlaceItem = (props) => {
  // Existing state hooks
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const auth = useContext(authContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // New state for comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  // Ratings state (from previous implementation)
  const [ratings, setRatings] = useState({
    likes: props.totalLikes || 0,
    dislikes: props.totalDislikes || 0,
  });
  const [userRating, setUserRating] = useState(null);

  // Fetch comments when component mounts or when place changes
  useEffect(() => {
    // If comments are passed via props during search, use those
    if (props.comments) {
      setComments(props.comments);
    } else {
      // Existing logic to fetch comments if not in search results
      const fetchComments = async () => {
        if (auth.isLoggedIn && props.id) {
          try {
            const responseData = await sendRequest(
              `${import.meta.env.VITE_BACKENED_URL}/places/${
                props.id
              }/comments`,
              "GET",
              null,
              {
                Authorization: "Bearer " + auth.token,
              }
            );

            setComments(responseData.comments || []);
          } catch (err) {
            console.error("Failed to fetch comments:", err);
          }
        }
      };
      fetchComments();
    }
  }, [auth.isLoggedIn, auth.token, props.id, props.comments, sendRequest]);

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim() || !auth.isLoggedIn) return;

    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKENED_URL}/places/${props.id}/comments`,
        "POST",
        JSON.stringify({ text: newComment }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      // Add new comment to the top of comments list
      setComments([responseData.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(
        "Failed to add comment:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };
  // Delete comment handler
  const handleDeleteComment = async (commentId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKENED_URL}/places/${
          props.id
        }/comments/${commentId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      // Remove the deleted comment from the list
      setComments(
        comments.filter((comment) => {
          return comment._id !== commentId;
        })
      );
    } catch (err) {
      console.error("Failed to delete comment:", err.response || err);
      alert(
        err.response?.data?.message ||
          "Failed to delete comment. Please try again."
      );
    }
  };

  // Existing methods for map, delete, etc.
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKENED_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      // After successful deletion in the backend, notify parent component
      if (props.onDelete) {
        props.onDelete(props.id);
      }
    } catch (err) {
      console.error("Deleting place failed:", err);
    }
  };

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      {/* Existing Map Modal */}
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      {/* Place Item Content */}
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}

          <div className="place-item__image">
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${props.image}`}
              alt={props.place}
            />
          </div>

          <div className="place-item__info">
            <h2>{props.place}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>

            {/* Rating Section */}
            <div className="place-item__ratings ">
              <button
                onClick={() => handleRating(1)}
                className={`rating-button like ${
                  userRating === 1 ? "active" : ""
                }`}
              >
                👍 {ratings.likes}
              </button>
              <h2 className="flex gap-2 text-red-500">
                Shared By:
                <Link to={`/profile/${props.user.id}`}>
                  <h2 className="underline text-red-700">
                    {props.user.userName}
                  </h2>
                </Link>
              </h2>
              <button
                onClick={() => handleRating(-1)}
                className={`rating-button dislike ${
                  userRating === -1 ? "active" : ""
                }`}
              >
                👎 {ratings.dislikes}
              </button>
            </div>

            {/* Comments Section */}
            <div className="place-item__comments">
              {auth.isLoggedIn && (
                <div className="comment-input-container">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                  />
                  <button
                    onClick={handleAddComment}
                    className="comment-submit-btn"
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              )}

              <div className="comments-header">
                <h4 onClick={() => setShowComments(!showComments)}>
                  Comments ({comments.length}){showComments ? " ▼" : " ►"}
                </h4>
              </div>
              {showComments &&
                comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    {/* Add this line */}
                    <div className="comment-header">
                      <span className="comment-username">
                        {comment.username}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    {comment.userId === auth.creatorId && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="comment-delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Actions Section */}
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {/* Only show edit and delete buttons if:
              1. User is logged in 
              2. User is the creator of the place */}

            {auth.isLoggedIn &&
              auth.creatorId ===
                (typeof props.user === "object"
                  ? props.user.id
                  : props.user) && (
                <>
                  <Button to={`/places/${props.id}`}>EDIT</Button>
                  <Button danger onClick={showDeleteWarningHandler}>
                    DELETE
                  </Button>
                </>
              )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
