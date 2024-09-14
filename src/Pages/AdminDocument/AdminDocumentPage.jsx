import React, { useState } from "react";

import AddDocument from "../../Components/DocumentAdminSide/AddDocument";
import GetDocuments from "../../Components/DocumentAdminSide/GetDocuments";

const AdminDocumentPage = () => {
  // State to control which view is displayed on small screens
  const [isUploading, setIsUploading] = useState(false);

  // Toggle between showing document list and upload form on small screens
  const handleToggle = () => {
    setIsUploading(!isUploading);
  };

  return (
    <div className="p-6">
      {/* Toggle Button for Small Screens */}
      <div className="lg:hidden mb-4">
        <button
          onClick={handleToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isUploading ? "View Uploaded Documents" : "Upload Document"}
        </button>
      </div>

      {/* Container for Large Screens */}
      <div className="hidden lg:flex lg:space-x-6">
        {/* Document List Panel */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Uploaded Documents
          </h2>
          <GetDocuments />
        </div>

        {/* Upload Document Panel */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Upload Document
          </h2>
          <AddDocument />
        </div>
      </div>

      {/* Container for Small Screens */}
      <div className={`lg:hidden ${isUploading ? "block" : "hidden"}`}>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Upload Document
          </h2>
          <AddDocument />
        </div>
      </div>

      <div className={`lg:hidden ${!isUploading ? "block" : "hidden"}`}>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Uploaded Documents
          </h2>

          <GetDocuments />
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentPage;
