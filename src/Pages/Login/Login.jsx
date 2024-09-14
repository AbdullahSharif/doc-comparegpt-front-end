import React, { useEffect } from "react";
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
      console.log(error.response.data.detail);
      toast.error(error.response.data.detail);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        toast.error(data.data.error, {});

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
    loginMutation.mutate(values);
  };

  return (
    <div className="login-container">
      <div className="name-of-site">
        <h1>DocCompareGPT</h1>
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
              <button type="submit" className="button">
                Log In
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
