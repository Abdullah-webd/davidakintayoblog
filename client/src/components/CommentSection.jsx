import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
const CommentSection = ({postId}) => {
    const {currentUser} = useSelector(state => state.user)
    const [comment,setComment] = useState('')
    const [commentData,setCommentData] = useState([])
    const [likeData,setLikeData] = useState([])
    const [likescount,setLikeCount] = useState([])
    console.log(postId)

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
      const day = date.getDate();
      
      return `${year}-${month}-${day}`;
    };

    const fetchNewComments = async () => {
      try {
        const response = await fetch(`/api/post/getComment/${postId}`); 
        const data = await response.json();
        if (response.ok) {
          setCommentData(data)
          console.log("Comment got successfully:", data);
        } else {
          console.error("Error posting comment:", data.message);
        }
      } catch (error) {
        console.log(error)
        
      }
    }

    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/post/getLike/${postId}`); 
        const data = await response.json();
        if (response.ok) {
          setLikeCount(data)
          console.log("Likes got successfully:", data);
        } else {
          console.error("Error posting comment:", data.message);
        }
      }
      catch (error) {
        console.log(error)
      }
    }
    

    const like = async () => {
      try {
        const response = await fetch(`/api/post/like/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setLikeData(data)
          fetchLikes()
          console.log("Post liked successfully:", data);
        }
      } catch (error) {
        console.log(error)
      }
    }
    

    useEffect(() => {
      const fetchComments = async () => {
        try {
          const response = await fetch(`/api/post/getComment/${postId}`); 
          const data = await response.json();
          if (response.ok) {
            setCommentData(data)
            console.log("Comment got successfully:", data);
          } else {
            console.error("Error posting comment:", data.message);
          }
        } catch (error) {
          console.log(error)
          
        }
      }

      fetchLikes()

      
      fetchComments() 
    },[])

    const handleComment = async(e) => {
      setComment(e.target.value)
    }

    const handleCommentSubmit = async()=>{
      try {
        const response = await fetch(`/api/post/comment/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({
            comment: comment,
            username: currentUser.username,
            profilePicture: currentUser.profilePicture,
          }),
        }); 
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          console.log("Comment posted successfully:", data);
          setComment('')
          fetchNewComments()
        } else {
          console.error("Error posting comment:", data.message);
        }
      } catch (error) {
        console.log(error)
        
      }
    }
    const dummyComments = [
        {
          id: 1,
          name: "Jane Doe",
          comment: "Wow, this was super helpful! Thanks for sharing 🔥",
          date: "April 10, 2025",
        },
        {
          id: 2,
          name: "John Smith",
          comment: "Great insights. Really enjoyed reading this!",
          date: "April 11, 2025",
        },
        {
          id: 3,
          name: "Amaka Johnson",
          comment: "This post explained everything so clearly. Love it ❤️",
          date: "April 12, 2025",
        },
      ];
  return (
    <>
      {/* Like & Comment Buttons */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          <button className="flex items-center gap-2 hover:text-blue-600 transition" onClick={()=>{like()}}>
            👍 Like:{likescount}
          </button>
          <button className="flex items-center gap-2 hover:text-green-600 transition">
            {currentUser ? `💬 Comment: ${commentData.length || 0}` : 'You must sign in to be able to comment'}
          </button>
        </div>

        {/* Comment Input Box */}
        <div className="mb-8">
          <textarea
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0A3150]"
            placeholder="Write a comment..."
            disabled={!currentUser}
            value={comment}
            onChange={(e) => handleComment(e)}
          ></textarea>
          <button className="mt-2 px-4 py-2 bg-[#0A3150] text-white rounded focus:opacity-50"
          onClick={()=>{handleCommentSubmit()
            
          }
          }
          disabled={!currentUser || !comment}>
            Post Comment
          </button>
        </div>

        {/* Other People's Comments */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">💬 Comments</h3>
          <div className="flex flex-col gap-4">
            {commentData && commentData.map((c) => (
              <div
                key={c.userId + c.comment + c.createdAt}
                className="bg-gray-100 p-4 rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-semibold">{c.username}</span>{" "}
                  <span className="text-gray-500 text-xs">({formatDate(c.createdAt)})</span>
                </p>
                <p className="text-sm text-gray-700">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentSection;
