import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Trash2 } from "lucide-react";

const SinglePostComments = ({ postId, goBack,title }) => {
  const [comments, setComments] = useState([]);
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    const fetchComments = async () => {

    try {
      const res = await fetch(`/api/post/getComment/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
            console.log("Comments fetched successfully:", data);
          setPostTitle(data.postTitle); // Assuming the response contains the post title
        } else {
          console.error("Error fetching comments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleDeleteComment = async (createdAt) => {
    try {
      const res = await fetch(
        `/api/post/deleteComment/${postId}?createdAt=${createdAt}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((c) => c.createdAt !== createdAt)
        );
        console.log("Comment deleted successfully:", data);
      } else {
        console.error("Error deleting comment:", data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  

  return (
    <div className="p-4">
      <Button color="gray" onClick={goBack} className="mb-4">
        ← Back to posts
      </Button>
      <h2 className="text-xl font-bold mb-4">
        Comments for: <span className="text-blue-600">{title}</span>
      </h2>

      {comments.length === 0 ? (
        <p>No comments yet for this post.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id + comment.username + comment.comment}
              className="bg-white p-4 rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{comment.username || "Anonymous"}</p>
                <p className="text-gray-700">{comment.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                color="failure"
                size="xs"
                onClick={() => handleDeleteComment(comment.createdAt)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SinglePostComments;
