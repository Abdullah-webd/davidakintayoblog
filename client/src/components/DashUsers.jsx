import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    ModalBody,
    ModalHeader,
    Button,
  } from "flowbite-react";
  import React, { useEffect, useState } from "react";
  import { HiOutlineExclamationCircle } from "react-icons/hi";
  
  const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/user/users");
          const data = await res.json();
          setUsers(data);
          console.log("Fetched users:", data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const openDeleteModal = (userId) => {
      setDeleteUserId(userId);
      setShowModal(true);
    };
  
    const handleDelete = async () => {
      try {
        const res = await fetch(`/api/user/deletebyAbdmin/${deleteUserId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (res.ok) {
          setUsers((prev) => prev.filter((user) => user._id !== deleteUserId));
          setShowModal(false);
        } else {
          console.error("Error deleting user:", res.statusText);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };
  
    return (
      <div className="p-4 table-auto overflow-x-scroll md:mx-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        {users.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Profile Picture</TableHeadCell>
                  <TableHeadCell>Username</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Admin</TableHeadCell>
                  <TableHeadCell>Created At</TableHeadCell>
                  <TableHeadCell>Delete</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt="profile"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => openDeleteModal(user._id)}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
  
            {/* Modal for confirming user deletion */}
            <Modal show={showModal} size="md" popup onClose={() => setShowModal(false)}>
              <ModalHeader />
              <ModalBody>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this user?
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
          <p className="text-gray-500 mt-4">No users found</p>
        )}
      </div>
    );
  };
  
  export default DashUsers;
  