import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage, resetForm } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import url from "../../utils/api";

export default function AddDocument() {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    description: "",
    document: null,
  };
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    name: Yup.string().required("Document name is required"),
    description: Yup.string().required("Description is required"),
    document: Yup.mixed()
      .required("A PDF document is required")
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => value && value.type === "application/pdf"
      ),
  });

  const uploadDocument = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      const formData = new FormData();
      formData.append("file", values.document);
      formData.append("name", values.name);
      formData.append("description", values.description);
      return axios.post(
        `${protocol}//${url}/admin/standard-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries(["documents"]);

      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error uploading your document");
      setIsLoading(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="panel bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Document</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            uploadDocument.mutate(values);
            resetForm();
          }}
        >
          {({ setFieldValue, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Document Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter document name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter document description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Document (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => {
                    setFieldValue("document", event.currentTarget.files[0]);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <ErrorMessage
                  name="document"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {"Upload Document"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="text-white">Uploading your document....</div>
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
