import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import url from "../../utils/api";
import axios from "axios";
import "./Login.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import userAuthStore from "../../stores/userauth/userauth";

const Login = () => {
  const [loading, setLoading] = useState(false); // Track the loading state
  const updateUser = userAuthStore((state) => state.setUser);

  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    password: Yup.string().required("Password is Required"),
  });

  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      return axios.post(`${protocol}//${url}/login`, values);
    },

    onError: (error) => {
      setLoading(false); // Stop the loader on error
      console.log(error.response.data.detail);
      toast.error(error.response.data.detail);
    },
    onSuccess: (data) => {
      setLoading(false); // Stop the loader on success
      if (data.data.error) {
        toast.error(data.data.error);
        return;
      }
      navigate("/admin/documents");
      toast.success(data.data.message);
      console.log(data.data);
      localStorage.setItem("access", data.data.access_token);
      localStorage.setItem("user", data.data.user_type);
      updateUser(data.data.user_type);
      if (data.data.user_type === "admin") {
        navigate("/admin/documents");
      } else if (data.data.user_type === "user") {
        navigate("/user/dashboard");
      }
    },
  });

  // Handle form submission
  const handleLogin = (values) => {
    setLoading(true); // Start the loader when login starts
    loginMutation.mutate(values);
  };

  return (
    <div className="login-container">
      <div className="name-of-site">
        <h1>RegCompliance - AI</h1>
      </div>

      <div className="form-container">
        <h2 className="title">Log In</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="input"
                />
                <ErrorMessage name="email" component="p" className="error" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input"
                />
                <ErrorMessage name="password" component="p" className="error" />
              </div>

              {/* The login button with a spinner inside it */}
              <button
                type="submit"
                className="button flex items-center justify-center"
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-3"
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
                  "Log In"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="redirect">
          Don't have an account?{" "}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
