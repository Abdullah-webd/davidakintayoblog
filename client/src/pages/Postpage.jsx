import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { Card } from "flowbite-react";
import CommentSection from "../components/CommentSection";

const Postpage = () => {
  const { slug } = useParams();
  const [post, setPost] = React.useState(null);
  const [popularPost, setPopularPost] = React.useState(null);
  const [relatedPost, setRelatedPost] = React.useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // 1️⃣ First useEffect - fetch the main post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getpost?slug=${slug}`);
        const data = await res.json();

        if (res.ok && data.posts.length > 0) {
          setPost(data.posts[0]);
          console.log("Fetched post:", data.posts[0]);
        } else {
          console.error("Post not found:", data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  // 2️⃣ Second useEffect - runs ONLY when 'post' is set, and fetches related posts
  useEffect(() => {
    if (!post?._id) return; // Wait until post is actually available

    const fetchRelatedPosts = async () => {
      try {
        const res = await fetch(`/api/post/relatedPost/${post._id}`);
        const data = await res.json();

        if (res.ok) {
          console.log("Fetched related posts:", data[0]);
          setRelatedPost(data[0]);
        } else {
          console.error("Error fetching related posts:", data);
        }
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };

    fetchRelatedPosts();
  }, [post]); // Only runs when `post` changes

  // 3️⃣ Popular posts (you already did this right 🎉)
  useEffect(() => {
    const popularPosts = async () => {
      try {
        const res = await fetch(`/api/post/popularPost`);
        const data = await res.json();

        if (res.ok) {
          console.log("Fetched popular posts:", data);
          setPopularPost(data);
        } else {
          console.error("Error fetching popular posts:", data);
        }
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      }
    };

    popularPosts();
  }, []);

  // Dummy comments for display

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Post Content */}
        <div className="flex-1">
          {post ? (
            <>
              <img
                src={post.image}
                alt={post.title}
                className="max-h-[400px] rounded-xl mb-4 w-full h-full object-cover transform transition-transform duration-500 hover:scale-102"
              />
              <h1 className="t2ext-3xl font-bold mb-2">{post.title}</h1>
              <p className="text-sm text-gray-500 mb-1">
                Category: {post.category} |{" "}
                {new Date(post.createdAt).toDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                ✍️ Author: <span className="font-medium">David Akintayo</span>
              </p>
              <div
                className="prose max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <CommentSection postId={post._id} />
            </>
          ) : (
            <p className="text-red-600">Post not found 😢</p>
          )}
        </div>

        {/* Popular Posts + Social Links */}
        <div className="w-full md:w-[300px] border-l border-gray-200 pl-6">
          {popularPost && <h2 className="text-xl font-semibold mb-4">Popular Posts</h2>}
          <div className="flex flex-col gap-4 mb-6">
            {popularPost &&
              popularPost.map((num) => (
                <Link to={`/posts/${num.slug}`} as="div">
                  <Card
                    key={num._id}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={
                        num.image ||
                        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNUEiqhLdVdGuzI3dePlJ9Gmyc0YqCplsQQ&s`
                      }
                      alt="popular"
                      className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                    />
                    <div className="p-2">
                      <h3 className="font-semibold text-sm mb-1">
                        {num.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(num.createdAt).toDateString()}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>

          {/* Social Media Links */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 text-xl"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      <div className="mt-12">
        {relatedPost && <h2 className="text-xl font-semibold mb-4">Related Posts</h2>}
        <div className="grid md:grid-cols-3 gap-6">
          {relatedPost && (
            <Link to={`/posts/${relatedPost.slug}`} as="div">
              <Card
                key={relatedPost._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={
                    relatedPost.image ||
                    `https://www.meersworld.net/wp-content/uploads/2020/06/Best-Blogger-Related-Posts-Widget-With-Thumbnails-min.png`
                  }
                  alt="related"
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">
                    {relatedPost.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(relatedPost.createdAt).toDateString()}
                  </p>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Postpage;
