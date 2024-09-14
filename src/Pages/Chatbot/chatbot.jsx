import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./chatbot.css";
import { useMutation } from "@tanstack/react-query";
import url from "../../utils/api";
import { marked } from "marked";
import DOMPurify from "dompurify";

const Chatbot = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([
    { user: "AI", text: "Hello, How would I help you in making your product, please tell your requirements. " },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const textarea = e.target;
    setInput(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const sendMessage = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;

      return axios.post(
        `${protocol}//${url}/user/chat`,
        {
          question: values.question,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
    },
    onSuccess: (response) => {
      setLoading(false);
      const responseData = response.data.response.content;

      // Convert Markdown to HTML using marked
      const htmlContent = marked(responseData);

      // Sanitize HTML to prevent XSS attacks
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);

      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "AI", text: sanitizedHtml },
      ]);
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error fetching chat response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: "AI",
          text: "Sorry, there was an error fetching the response.",
        },
      ]);
    },
  });

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "You", text: input },
      ]);
      setInput("");
      inputRef.current.style.height = "3rem";
      setLoading(true);
      sendMessage.mutate({ question: input });
    }
  };

  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener("keydown", handleEnterKey);

    return () => {
      inputElement.removeEventListener("keydown", handleEnterKey);
    };
  }, [input]);

  return (
    <div className="main-container">
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="chat-title">Reg-Compliance AI</h2>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.user === "You" ? "sent" : "ai-response"
              }`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          ))}
          {loading && (
            <div className="chat-message ai-response">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="chat-send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
