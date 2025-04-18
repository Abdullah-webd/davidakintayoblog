import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "flowbite-react";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/post/getpost`);
        const data = await res.json();
        setResults(data.posts || []);
        console.log("Search results:", data.posts);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  },[])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/post/getpost?searchTerm=${searchQuery}`);
        const data = await res.json();
        setResults(data.posts || []);
        console.log("Search results:", data.posts);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery]);

  

  return (
    <div className="p-6 h-[100vh]">
      <h2 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-600">{searchQuery}</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-red-500">No results found.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {results.map((post) => (
            <div key={post._id} className="w-full md:w-[300px] border-l border-gray-200 pl-6">
              <Link to={`/posts/${post.slug}`}>             
                <Card className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <img
                    src={post.image || "https://via.placeholder.com/300x150"}
                    alt={post.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
