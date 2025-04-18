import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // 👈 important!

import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [popularPost, setPopularPost] = React.useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const hasVisitedToday = localStorage.getItem("hasVisitedToday");

    if (hasVisitedToday !== today) {
      const createNewVisitor = async () => {
        try {
          const res = await fetch("/api/post/newVisitor", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });

          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("hasVisitedToday", today);
            console.log("New visitor logged");
          } else {
            console.error("Visitor log failed:", data.message);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };

      createNewVisitor();
    }
  }, []);

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

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getpost");
      const data = await res.json();
      setPosts(data.posts);
      console.log(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-10 p-6">
      {/* Carousel at the top */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={false}
        className="w-full h-90 rounded-md"
      >
        {posts.slice(0, 5).map((post) => (
          <SwiperSlide key={post._id}>
            <div className="relative w-full h-90">
              <img
                src={
                  post.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHBFnm2wqmDjMdT-x0QR04GOkB_z5bZ1tzcA&s"
                }
                alt={post.title}
                className="w-full h-full object-cover opacity-80 rounded-md"
              />
              <div className="absolute bottom-0 left-0 bg-opacity-50 w-full p-4">
                <h3 className="text-white text-lg font-bold">{post.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <SwiperSlide >
            <div className="relative w-full h-90">
              <img
                src={
                  
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHBFnm2wqmDjMdT-x0QR04GOkB_z5bZ1tzcA&s"
                }
                alt={'title'}
                className="w-full h-full object-cover opacity-80 rounded-md"
              />
              <div className="absolute bottom-0 left-0 bg-opacity-50 w-full p-4">
                <h3 className="text-white text-lg font-bold">another post</h3>
              </div>
            </div>
          </SwiperSlide>

      </Swiper>

      {/* Below Carousel: Blog Posts on left, Socials & Popular on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Blog Posts */}
        <div className="lg:col-span-3 space-y-6 flex flex-col gap-5">
          <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
          {posts.slice(0, 5).map((post) => (
            <Link to={`/posts/${post.slug}`} as="div" key={post._id}>
              <Card>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-5">{post.title}</h3>
                  <div className="flex lg:flex-row flex-col gap-3 lg:items-start lg:justify-start">
                    {/* Image Zoom Wrapper */}
                    <div className="overflow-hidden rounded w-full h-48">
                      <img
                        src={
                          post.image || "https://via.placeholder.com/400x200"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    <p
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          post.content.length > 100
                            ? post.content.slice(0, 700) + "..."
                            : post.content,
                      }}
                    />
                  </div>

                  <div  
                    className="text-blue-600 hover:underline"
                  >
                    Read more
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          <div className="mt-6 text-center">
            <Link
              to="/posts"
              className="inline-block text-blue-600 hover:text-blue-800 font-medium text-lg transition duration-200"
            >
              View All Posts →
            </Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[300px] border-l border-gray-200 pl-6">
          <h2 className="text-xl font-semibold mb-4">Popular Posts</h2>
          <div className="flex flex-col gap-4 mb-6">
            {popularPost && (popularPost.map((num) => (
              <Link to={`/posts/${num.slug}`} as="div"  key={num._id}>            
                <Card
                 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={num.image || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNUEiqhLdVdGuzI3dePlJ9Gmyc0YqCplsQQ&s`}
                    alt="popular"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">
                      {num.title}
                    </h3>
                    <p className="text-xs text-gray-500">{new Date(num.createdAt).toDateString()}</p>
                  </div>
                </Card>
              </Link>
            )))}
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
    </div>
  );
};

export default Home;
