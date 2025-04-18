import React, { useState } from "react";
import {
  Button,
  Navbar,
  TextInput,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../rdeux/theme/themeSlice.js";
import { signOutSuccess } from "../rdeux/user/userSlice.js";
import { searchPost } from "../rdeux/search/searchSlice.js";

const Header = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [searchText, setSearchText] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(searchPost(searchText));
      navigate(`/posts?query=${searchText}`);
      setSearchText("");
      setIsMobileSearchOpen(false); // close modal if open
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setShowAlert(true);
        setAlertContent(data.message);
      }
      dispatch(signOutSuccess());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Navbar className="border-b-2 bg-[#0A3150] ">
        <Link to="/" className="self-center text-md font-semibold text-white">
          <span className="px-2 py-1 rounded-lg text-white max-sm:text-sm">
            David Akintayo's
          </span>
          Blog
        </Link>

        <form action="">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="w-50 max-sm:hidden min-lg:w-150"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            value={searchText}
          />
        </form>

        <nav className="max-md:hidden">
          <ul className="text-gray-400 flex gap-7">
            <li>
              <a href="/" className={`${path === "/" && "text-white"}`}>
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className={`${path === "/about" && "text-white"}`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/posts"
                className={`${path === "/posts" && "text-white"}`}
              >
                Post
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex gap-2 md:order-2 max-sm:gap-3">
          {/* Mobile Search Button */}
          <button
            className="sm:hidden text-white"
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <AiOutlineSearch size={20} />
          </button>

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
            >
              <DropdownHeader>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              <Link to="/dashboard?tab=profile" as='div'>
                <DropdownItem>Profile</DropdownItem>
              </Link>
              <DropdownDivider />
              <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button
                outline
                className="hover:bg-gradient-to-r hover:outline-none from-purple-500 via-purple-500 to-blue-500"
              >
                Sign In
              </Button>
            </Link>
          )}

          <button type="button" className="hidden max-md:inline" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <IoMdMenu color="white" style={{ fontSize: 20 }} />
          </button>
        </div>
      </Navbar>

      {/* Sidebar Drawer */}
      <div
        id="drawer-navigation"
        className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-gray-800`}
      >
        <h5 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          My App
        </h5>

        <nav className="flex flex-col space-y-4" >
          <a
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            onClick={() => setIsDrawerOpen(false)}
          >
            Home
          </a>
          <a
            href="/posts"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            onClick={() => setIsDrawerOpen(false)}
          >
            Posts
          </a>
          <a
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            onClick={() => setIsDrawerOpen(false)}
          >
            About
          </a>
          <a
            href="/dashboard?tab=profile"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            onClick={() => setIsDrawerOpen(false)}
          >
            Profile
          </a>
          
        </nav>

        <button
          onClick={() => setIsDrawerOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* Mobile Search Modal */}
      <Modal show={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)}>
        <ModalHeader>Search Posts</ModalHeader>
        <ModalBody>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsMobileSearchOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Header;
