// src/contexts/FileContext.js
import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [files, setFiles] = useState({
        standard_document: null,
        personal_document: null,
    });

    const updateFiles = (newFiles) => {
        setFiles(prevFiles => ({
            ...prevFiles,
            ...newFiles,
        }));
    };

    return (
        <FileContext.Provider value={{ files, updateFiles }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => useContext(FileContext);
