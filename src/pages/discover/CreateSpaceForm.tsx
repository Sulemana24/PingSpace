import React, { useState } from "react";

const CreateSpaceForm = () => {
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate submission
    console.log({
      name: spaceName,
      description,
      tags,
      image: imagePreview,
    });

    setSuccessMessage("Space created successfully!");

    // Reset form fields
    setSpaceName("");
    setDescription("");
    setTags([]);
    setTagInput("");
    setImagePreview(null);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Create a New Space
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
          {successMessage}
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Space Name</label>
        <input
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-800  dark:border-gray-700"
          placeholder="e.g. Web Developers"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          rows={3}
          placeholder="Brief description of the space..."
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-white px-3 py-1 rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-sm font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          placeholder="Press Enter or comma to add a tag"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Upload Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400"
        />
        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-[100px] h-auto rounded border dark:border-neutral-700"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
      >
        Create Space
      </button>
    </form>
  );
};

export default CreateSpaceForm;
