import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import url from "../../utils/api";

// Fetching function to retrieve documents
const fetchDocuments = async () => {
  const protocol = window.location.protocol;
  const token = localStorage.getItem("access");
  const response = await axios.get(
    `${protocol}//${url}/admin/standard-document`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("res", response.data);
  return response.data;
};

const GetDocuments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const queryClient = useQueryClient();

  // Using useQuery to fetch documents
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });

  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId) => {
      const protocol = window.location.protocol;
      const token = localStorage.getItem("access");
      await axios.delete(
        `${protocol}//${url}/admin/standard-document/${documentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch the documents after successful deletion
      queryClient.invalidateQueries(["users"]);
      toast.success("Document deleted successfully");
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error.response.data.detail);
      toast.error(error.response.data.detail);
    },
  });

  // Function to handle delete action
  const handleDelete = () => {
    if (selectedUser) {
      deleteDocumentMutation.mutate(selectedUser._id);
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          Uploaded Documents
        </h1>
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
            <p className="ml-4">Loading documents...</p>
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
                  <th className="py-3 px-4 border-b-2">Document Name</th>
                  <th className="py-3 px-4 border-b-2">Description</th>
                  <th className="py-3 px-4 border-b-2">Document Index</th>
                  <th className="py-3 px-4 border-b-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 &&
                  users.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.nameofdoc}</td>
                      <td className="py-3 px-4">{user.description}</td>
                      <td className="py-3 px-4">{user.index_name}</td>
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
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Confirming Deletion */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
              <h2 className="text-xl font-bold mb-4">
                Are you sure you want to delete {selectedUser?.nameofdoc}?
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
                  disabled={deleteDocumentMutation.isLoading}
                >
                  {deleteDocumentMutation.isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetDocuments;
