import React, { useState } from "react";
import axios from "axios";
import { useFileContext } from "../FileContext/filecontext";
import url from "../../utils/api";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./generatereport.css"; // Import the CSS

const GenerateReport = () => {
  const { files } = useFileContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerateReport = async () => {
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("standard_file", files.standard_document);
    formData.append("personal_file", files.personal_document);

    try {
      const protocol = window.location.protocol;
      const response = await axios.post(`${protocol}//${url}/admin/compare-document`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const markdownReport = response.data.Report.content;
      const htmlContent = marked(markdownReport);
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);

      setResult(sanitizedHtml);
    } catch (error) {
      console.error("Error generating report:", error);
      setResult("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="report-container">
        <div className="report-header">
          <h2 className="report-title">Document Comparison Report</h2>
        </div>
        <div className="report-content">
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Generating report, this takes about 4 minutes for 100 pages</p>
            </div>
          ) : (
            <div className="report-result">
              {result ? (
                <div className="markdown-content" dangerouslySetInnerHTML={{ __html: result }} />
              ) : (
                <p>No report generated yet.</p>
              )}
            </div>
          )}
        </div>
        <div className="report-actions">
          <button 
            onClick={handleGenerateReport} 
            className="generate-report-button"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
