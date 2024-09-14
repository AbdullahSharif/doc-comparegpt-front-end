import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import url from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useFileContext } from "../FileContext/filecontext";
import SelectAdminDocument from "../../Components/UserDashboard/SelectAdminDocuments";

const fetchUsers = async () => {
  const protocol = window.location.protocol;
  const token = localStorage.getItem("access");
  const response = await axios.get(
    `${protocol}//${url}/user/document-for-chat`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const UserDashboard = () => {
  const { updateFiles } = useFileContext();
  const initialValues_Standard_Personal = {
    personal_document: null,
    standard_document: null,
  };

  const Validation_Schema_Standard_Personal = Yup.object({
    personal_document: Yup.mixed()
      .required("Personal document is required")
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => !value || value.type === "application/pdf"
      ),
    standard_document: Yup.mixed()
      .required("Standard document is required")
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => !value || value.type === "application/pdf"
      ),
  });

  const navigate = useNavigate();

  const Standard_Personal_ChatSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    try {
      setSubmitting(true);
      updateFiles({
        personal_document: values.personal_document,
        standard_document: values.standard_document,
      });
      resetForm();
      navigate("/user/generatereport");
    } catch (error) {
      console.error("Error uploading document:", error);
      setFieldError("personal_document", "Failed to upload document");
      setFieldError("standard_document", "Failed to upload document");
    } finally {
      setSubmitting(false);
    }
  };

  const AdminDeleteDoc = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const queryClient = useQueryClient();

    const {
      data: users,
      isLoading,
      isError,
      error,
    } = useQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
    });

    const handleDelete = async () => {
      if (selectedUser) {
        try {
          const id = selectedUser._id;
          navigate(`/chatbot/${id}`);
        } catch (error) {
          console.error("Unable to select user", error);
        }
      }
    };

    const openModal = (user) => {
      console.log("user", user);
      setSelectedUser(user);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedUser(null);
    };

    return <div>{/* Modal logic here */}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to DocCompareGPT</h1>
        <h2 className="text-2xl text-gray-700 mt-4">
          Please choose an option below to continue.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Standard & Personal Documents Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:bg-blue-100 transition-colors flex flex-col justify-between">
          <h2 className="text-lg font-bold mb-4 text-center text-gray-700">
            Upload a Standard and Personal Document to check alignment
          </h2>

          <Formik
            initialValues={initialValues_Standard_Personal}
            validationSchema={Validation_Schema_Standard_Personal}
            onSubmit={Standard_Personal_ChatSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="standard_document"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Standard Document
                  </label>
                  <input
                    id="standard_document"
                    name="standard_document"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setFieldValue(
                        "standard_document",
                        event.currentTarget.files[0]
                      )
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <ErrorMessage
                    name="standard_document"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="personal_document"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Personal Document
                  </label>
                  <input
                    id="personal_document"
                    name="personal_document"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setFieldValue(
                        "personal_document",
                        event.currentTarget.files[0]
                      )
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <ErrorMessage
                    name="personal_document"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className={`${
                    isSubmitting
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Ask AI Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:bg-blue-100 transition-colors flex flex-col justify-between">
          <SelectAdminDocument />
        </div>
      </div>

      <div className="mt-8">{AdminDeleteDoc()}</div>
    </div>
  );
};

export default UserDashboard;
