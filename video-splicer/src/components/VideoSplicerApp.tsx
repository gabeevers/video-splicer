

"use client";

import { useState } from "react";

export default function VideoSplicerApp() {
  const [video, setVideo] = useState<File | null>(null);
  const [snippets, setSnippets] = useState<string[]>([""]);
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "video/mp4") {
        setError("Please select an MP4 video file");
        return;
      }
      setVideo(file);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!video) {
      setError("Please select a video file");
      return;
    }

    const validSnippets = snippets.filter(s => s.trim());
    if (validSnippets.length === 0) {
      setError("Please add at least one clip instruction");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video", video);
    formData.append("instructions", validSnippets.join(","));

    try {
      const res = await fetch("/api/splice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process video");
      }

      const data = await res.json();
      setOutput(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addExample = () => {
    setSnippets([...snippets, "00:13:00"]);
  };

  const removeSnippet = (index: number) => {
    const updated = snippets.filter((_, i) => i !== index);
    setSnippets(updated.length === 0 ? [""] : updated);
  };

  const updateSnippet = (index: number, value: string) => {
    const updated = [...snippets];
    updated[index] = value;
    setSnippets(updated);
  };

  const addSnippet = () => {
    setSnippets([...snippets, ""]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🎬 Video Splicer</h1>
        <p className="text-gray-800">Upload an MP4 video and create clips or capture frames based on time instructions</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* File Upload */}
        <div>
                      <label className="block mb-3 font-semibold text-gray-900">Upload MP4 Video</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <div className="text-gray-800">
                  {video ? `Selected: ${video.name}` : "Click to select MP4 video file"}
                </div>
                <div className="text-sm text-gray-700">
                  {video ? `${(video.size / (1024 * 1024)).toFixed(1)} MB` : "Supports MP4 format"}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-900">Clip Instructions</label>
            <button
              type="button"
              onClick={addExample}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Add Example
            </button>
          </div>
          
          <div className="space-y-3">
            {snippets.map((snippet, index) => (
              <div key={index} className="flex items-center space-x-2">
                                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                    placeholder="e.g. 00:13:00, 00:13:00-00:13:30, -00:05:00, 00:20:00-"
                    value={snippet}
                    onChange={(e) => updateSnippet(index, e.target.value)}
                  />
                {snippets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSnippet(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addSnippet}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            + Add Instruction
          </button>

          {/* Instructions Help */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Instruction Format Examples:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><code className="bg-blue-100 px-1 rounded">13:00</code> → Capture frame at 13 minutes</li>
              <li><code className="bg-blue-100 px-1 rounded">13:00-</code> → From 13 minutes to end of video</li>
              <li><code className="bg-blue-100 px-1 rounded">-13:00</code> → From start to 13 minutes</li>
              <li><code className="bg-blue-100 px-1 rounded">13:00-13:30</code> → From 13:00 to 13:30</li>
              <li><code className="bg-blue-100 px-1 rounded">00:13:00</code> → Full time format (HH:MM:SS)</li>
            </ul>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !video}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Video...
            </div>
          ) : (
            "🎞️ Splice Video"
          )}
        </button>
      </div>

      {/* Output Files */}
      {output.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">✅ Generated Files</h2>
          <div className="grid gap-3">
            {output.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {file.includes('frame') ? '🖼️' : '🎬'}
                  </div>
                  <span className="font-mono text-sm text-gray-900">{file.split('/').pop()}</span>
                </div>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}