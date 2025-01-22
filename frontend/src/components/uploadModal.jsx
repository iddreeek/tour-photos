// components/UploadModal.js
'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !description) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      await onUpload(formData);
      setFile(null);
      setTitle("");
      setDescription("");
      onClose(); // Close modal after successful upload
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Photo</h2>
          <Button variant="outline" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}
