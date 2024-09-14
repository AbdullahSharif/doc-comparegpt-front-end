// src/components/ChatWithAI.js
import React from "react";
import { useNavigate } from "react-router-dom";

const SelectAdminDocument = () => {
  const navigate = useNavigate();

  // Handle navigation to the chatbot page
  const handleChatWithAI = () => {
    navigate(`/chatbot`);
  };

  return (
    // <div className="rounded-2xl panel bg-white shadow-md hover:bg-blue-100 flex justify-center items-center h-96">
    <div className="text-center">
      <h1 className="text-xl font-bold mb-4">
        Ask questions about your product with respect to out
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 my-10 px-6 rounded"
        onClick={handleChatWithAI}
      >
        Ask AI
      </button>
      {/* </div> */}
    </div>
  );
};

export default SelectAdminDocument;
