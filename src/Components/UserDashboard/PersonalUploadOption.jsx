import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import url from "../../utils/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function PersonalUploadOption() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues_Personal = {
    personal_document: null,
  };

  const Validation_Schema_Personal = Yup.object({
    personal_document: Yup.mixed()
      .required("Personal document is required")
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => !value || value.type === "application/pdf"
      ),
  });

  const uploadDocument = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      const formData = new FormData();
      console.log("valyes", values);
      formData.append("file", values.file);
      console.log("Formdata", formData);
      return axios.post(
        `${protocol}//${url}/user/document-for-chat`,
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
    onSuccess: (data) => {
      toast.success(data.data.message);
      console.log(data, "data");
      setIsLoading(false);
      navigate("/chatbot/" + data.data.document_id);
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

  const Personal_ChatSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    try {
      uploadDocument.mutate(
        { file: values.personal_document },
        {
          onSuccess: () => {
            resetForm();
          },
          onError: (error) => {
            console.error("Error uploading document:", error);
            setFieldError("personal_document", "Failed to upload document");
          },
        }
      );
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-200 hover:bg-blue-100 transition-colors flex flex-col justify-between">
      <div className="block text-gray-700 text-l font-bold mb-2 text-center">
        <h2>
          Upload a PersonalStandard Document and ask questions regarding it
        </h2>
      </div>
      <div>
        <Formik
          initialValues={initialValues_Personal}
          validationSchema={Validation_Schema_Personal}
          onSubmit={Personal_ChatSubmit}
        >
          {({ setFieldValue, handleSubmit }) => (
            <Form>
              <div>
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
                    onChange={(event) => {
                      setFieldValue(
                        "personal_document",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <ErrorMessage
                    name="personal_document"
                    component="div"
                    className="text-red-500 text-xs italic mt-2"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  ) : (
                    "Proceed to Chat"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
