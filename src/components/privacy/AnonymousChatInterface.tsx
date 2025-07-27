import React, { useState } from "react";
import { FaUserPlus, FaHeart, FaUsers } from "react-icons/fa";

const sampleData = [
  {
    id: 1,
    type: "People",
    name: "John Doe",
    description: "Frontend Developer at TechHub",
  },
  {
    id: 2,
    type: "People",
    name: "Jane Smith",
    description: "UI/UX Designer and Blogger",
  },
  {
    id: 3,
    type: "Pages",
    name: "Tech Trends",
    description: "Latest in technology and innovation",
  },
  {
    id: 4,
    type: "Pages",
    name: "CodeDaily",
    description: "Daily tips for programmers",
  },
  {
    id: 5,
    type: "Communities",
    name: "React Developers",
    description: "A group for React lovers",
  },
  {
    id: 6,
    type: "Communities",
    name: "Startup Builders",
    description: "For founders and makers",
  },
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [followedItems, setFollowedItems] = useState<number[]>([]);

  const handleToggleFollow = (id: number) => {
    setFollowedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredData = sampleData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-white dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Find new people and communities
        </p>

        <input
          type="text"
          placeholder="Search communities..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {item.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {item.description}
            </p>

            <button
              onClick={() => handleToggleFollow(item.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium ${
                followedItems.includes(item.id)
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {item.type === "People" && <FaUserPlus />}
              {item.type === "Pages" && <FaHeart />}
              {item.type === "Communities" && <FaUsers />}
              {followedItems.includes(item.id)
                ? item.type === "Pages"
                  ? "Liked"
                  : "Following"
                : item.type === "Pages"
                ? "Like"
                : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
