import React, { useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../utils/api";
import "./admin.css";
import { toast } from "react-toastify";

// Fetching function to retrieve users
const fetchUsers = async () => {
  const protocol = window.location.protocol;
  const token = localStorage.getItem("access");
  const response = await axios.get(`${protocol}//${url}/admin/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("r", response.data);
  return response.data;
};
const AllUsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Using useQuery to fetch users
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const queryClient = useQueryClient();

  // Function to handle delete action
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        const protocol = window.location.protocol;
        const token = localStorage.getItem("access");
        console.log("object", selectedUser);
        await axios.delete(
          `${protocol}//${url}/admin/all-users/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Invalidate and refetch users after deletion
        queryClient.invalidateQueries(["users"]);
        toast.success("User deleted successfully");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // Function to open the modal
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      <div className="panel bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mt-32">
        <h1 className="text-2xl font-bold mb-4 text-center">Users List</h1>
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
            <p className="ml-4">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div
            className="bg-red-100 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              Failed to fetch users: {error.message}
            </span>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4 border-b-2">Name</th>
                  <th className="py-3 px-4 border-b-2">Email</th>
                  <th className="py-3 px-4 border-b-2">User Type</th>
                  <th className="py-3 px-4 border-b-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 &&
                  users.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.user_type}</td>
                      <td className="py-3 px-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => openModal(user)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-3 px-4">
                      No users sign up yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
              <h2 className="text-xl font-bold mb-4">
                Are you sure you want to delete {selectedUser?.name}?
              </h2>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
