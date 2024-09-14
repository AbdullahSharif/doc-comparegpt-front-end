import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import url from "../../utils/api";
import "./Signup.css";
import userAuthStore from "../../stores/userauth/userauth";
// Validation schema using Yup
const SignupSchema = Yup.object({
  name: Yup.string().required("Name is Required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required"),
  password: Yup.string().required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const updateUser = userAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false); // Track the loading state

  const signUpMutuation = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      console.log(protocol);
      console.log(url);
      return axios.post(`${protocol}//${url}/signup`, {
        username: values.name,
        email: values.email,
        password: values.password,
        user_type: "user",
      });
    },

    onError: (error) => {
      console.log(error.response.data.detail);
      toast.error(error.response.data.detail);
    },
    onSuccess: (data) => {
      // if (data.data.error) {
      //   toast.error(data.data.error, {});

      //   return;
      // }

      // toast.success("User created succssfully");
      // localStorage.setItem("access", data.data.access_token);
      // localStorage.setItem("user", data.data.user_type);
      // if (data.data.user_type === "user") {
      //   navigate("/user/dashboard");
      // } else {
      //   navigate("/admin/documents");
      // }
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
  const handleSignup = (values) => {
    setLoading(true); // Start the loader when login starts
    signUpMutuation.mutate(values);
  };

  return (
    <div className="signup-container">
      <div className="name-of-site">
        <h1>DocCompareGPT</h1>
      </div>
      <div className="form-container">
        <h2 className="title">Create Your Account</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="input"
                />
                <ErrorMessage name="name" component="p" className="error" />
              </div>
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
              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="input"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="error"
                />
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
                  "Sign Up"
                )}
              </button>
            </Form>
          )}
        </Formik>
        <p className="redirect">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
