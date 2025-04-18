import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  Button,
} from "flowbite-react";
import { Trash2 } from "lucide-react";
import SinglePostComments from "./SinglePostComments";

const DashComments = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getpost");
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
      console.log("Posts fetched successfully:", data.posts);
    };
    fetchPosts();
  }, []);

  if (selectedPostId) {
    return (
      <SinglePostComments
        postId={selectedPostId}
        goBack={() => setSelectedPostId(null)}
        title = {posts.find((post) => post._id === selectedPostId)?.title}
      />
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Posts & Comments</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Image</TableHeadCell>
            <TableHeadCell>Total Comments</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedPostId(post._id)}
            >
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <img
                  src={post.image}
                  alt="post"
                  className="w-14 h-14 object-cover rounded"
                />
              </TableCell>
              <TableCell>{post.comments?.length || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashComments;
