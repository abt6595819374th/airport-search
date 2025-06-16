import React, { useState } from "react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setError(null);
        setSuccessMessage(null);
      } else {
        setSelectedFile(null);
        setError("Please upload a valid CSV file.");
        setSuccessMessage(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/airports/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`An error occurred while uploading the file: ${response.status}`);
      }

      setSuccessMessage(`File uploaded successfully`);
  }  catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred while uploading the file.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-stone-100 shadow-lg p-8 border border-slate-300">
      <h1 className="text-2xl font-semibold text-center text-slate-800 mb-4">
        Upload Airports CSV
      </h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-800
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-semibold
                   file:bg-stone-300 file:text-slate-800
                   hover:file:bg-stone-400 mb-4"
      />

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-stone-300 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-stone-400 transition-colors disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      {successMessage && (
        <p className="text-green-600 text-sm mt-4">{successMessage}</p>
      )}
    </div>
  );
}
