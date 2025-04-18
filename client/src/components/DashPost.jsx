import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow,
    TableCell,
    ModalHeader,
    ModalBody,
    Button,
    Modal,
  } from "flowbite-react";
  import React, { useEffect, useState } from "react";
  import { HiOutlineExclamationCircle } from "react-icons/hi";
  import { useSelector } from "react-redux";
  import { useDispatch } from "react-redux";
  import { createPost } from "../rdeux/posts/postSlice";
import { Link } from "react-router-dom";
  
  const DashPost = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [showMore, setShowMore] = useState(true);
  
    // modal state
    const [showModal, setShowModal] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);
  
    const openDeleteModal = (postId) => {
      setDeletePostId(postId);
      setShowModal(true);
    };
  
    const handleDelete = async () => {
      try {
        const res = await fetch(`/api/post/delete/${deletePostId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (res.ok) {
          setUserPosts((prev) => prev.filter((post) => post._id !== deletePostId));
          dispatch(
            createPost(userPosts.filter((post) => post._id !== deletePostId))
          );
          setShowModal(false);
          
        } else {
          console.error("Error deleting post:", res.statusText);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await fetch(
            `/api/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}&limit=9`,
          );
          const data = await res.json();
  
          if (res.ok) {
            const newPosts = data.posts || [];
            setUserPosts((prev) => [...prev, ...newPosts]);
            dispatch(createPost(newPosts));
            setTotalPosts(data.totalPosts);
  
            if (userPosts.length + newPosts.length >= data.totalPosts) {
              setShowMore(false);
            }
            console.log("Fetched posts:", newPosts);
          } else {
            console.error("Error response:", data);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
  
      if (currentUser?.isAdmin) {
        fetchPosts();
      }
    }, [currentUser, startIndex]);
  
    return (
      <div className="p-4 table-auto overflow-x-scroll md:mx-auto scrollbar scroll-track-slate-100 scrollbar-thumb-slate-300">
        {currentUser?.isAdmin && userPosts.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Date updated</TableHeadCell>
                  <TableHeadCell>Post image</TableHeadCell>
                  <TableHeadCell>Post title</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  <TableHeadCell>Delete</TableHeadCell>
                  <TableHeadCell>Edit</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        <Link to={`/posts/${post.slug}`} as='div'>
                        <img
                            src={post.image}
                            alt="post"
                            className="w-16 h-16 object-cover rounded"
                        />
                        </Link>
                    </TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.category || "N/A"}</TableCell>
                    <TableCell>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => openDeleteModal(post._id)}
                      >
                        Delete
                      </button>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:underline" onClick={() => window.location.href = `/update-post/${post._id}`}>
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
  
            {showMore && (
              <button
                className="w-full text-teal-500 self-center text-sm py-7"
                onClick={() => setStartIndex(startIndex + 9)}
              >
                Show more
              </button>
            )}
  
            {/* ✅ Single modal, used for all posts */}
            <Modal show={showModal} size="md" popup onClose={() => setShowModal(false)}>
              <ModalHeader />
              <ModalBody>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this post?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="red" onClick={handleDelete}>
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </>
        ) : (
          <p className="text-gray-500 mt-4">You have no posts yet</p>
        )}
      </div>
    );
  };
  
  export default DashPost;
  