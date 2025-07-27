import { useState } from "react";
import {
  FaUserFriends,
  FaUsers,
  FaBuilding,
  FaHeart,
  FaPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const initialData = [
  {
    id: 1,
    type: "person",
    name: "Iddrisu Sulemana",
    description: "Web Developer from Accra",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 2,
    type: "community",
    name: "React Devs GH",
    description: "A group for React developers in Ghana",
    image: "https://picsum.photos/seed/group1/100/100",
  },
  {
    id: 3,
    type: "page",
    name: "Tech World",
    description: "Latest updates in technology",
    image: "https://picsum.photos/seed/page1/100/100",
  },
  {
    id: 4,
    type: "person",
    name: "Yussif Hawawu",
    description: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    type: "community",
    name: "Freelancers Hub",
    description: "Connect with other freelancers",
    image: "https://picsum.photos/seed/group2/100/100",
  },
  {
    id: 6,
    type: "page",
    name: "Ghana Events",
    description: "Discover upcoming events in Ghana",
    image: "https://picsum.photos/seed/page2/100/100",
  },
];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(
    initialData.map((item) => ({ ...item, followed: false }))
  );

  const handleToggle = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, followed: !item.followed } : item
      )
    );
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-white dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Find new people, pages, and communities
        </p>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {item.description}
            </p>

            <div className="flex items-center gap-2">
              {item.type === "person" && (
                <>
                  <FaUserFriends className="text-blue-500" />
                  <span className="text-xs text-blue-600 font-semibold">
                    Person
                  </span>
                </>
              )}
              {item.type === "community" && (
                <>
                  <FaUsers className="text-green-500" />
                  <span className="text-xs text-green-600 font-semibold">
                    Community
                  </span>
                </>
              )}
              {item.type === "page" && (
                <>
                  <FaBuilding className="text-purple-500" />
                  <span className="text-xs text-purple-600 font-semibold">
                    Page
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => handleToggle(item.id)}
              className={`mt-4 px-4 py-1 text-sm font-medium rounded-full flex items-center gap-2 transition-colors ${
                item.followed
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {item.type === "page" ? (
                item.followed ? (
                  <>
                    <FaTimes /> Unlike
                  </>
                ) : (
                  <>
                    <FaHeart /> Like
                  </>
                )
              ) : item.followed ? (
                <>
                  <FaCheck /> Following
                </>
              ) : (
                <>
                  <FaPlus /> Follow
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No matches found for "{search}"
        </p>
      )}
    </div>
  );
}
