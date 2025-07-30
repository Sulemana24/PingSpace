import { useState } from "react";
import {
  FaCheck,
  FaPlus,
  FaStar,
  FaSearch,
  FaPuzzlePiece,
  FaMapMarkerAlt,
  FaUserFriends,
} from "react-icons/fa";
import { BiBadgeCheck } from "react-icons/bi";
import {
  MdSmartToy,
  MdEmojiEmotions,
  MdSchedule,
  MdPoll,
  MdGames,
} from "react-icons/md";
import CreateSpaceForm from "./CreateSpaceForm";

const groupData = [
  {
    id: 1,
    name: "React Devs GH",
    description: "A group for React developers in Ghana",
    image: "https://picsum.photos/seed/group1/100/100",
    tags: ["React", "Ghana", "Web Dev"],
    category: "Technology",
    verified: true,
    members: 1240,
  },
  {
    id: 2,
    name: "Freelancers Hub",
    description: "Connect with freelancers around Africa",
    image: "https://picsum.photos/seed/group2/100/100",
    tags: ["Remote", "Freelance", "Networking"],
    category: "Business",
    verified: false,
    members: 890,
  },
  {
    id: 3,
    name: "Startup Founders",
    description: "A community for startup founders in Africa",
    image: "https://picsum.photos/seed/group4/100/100",
    tags: ["Startups", "Business", "Networking"],
    category: "Business",
    verified: true,
    members: 5870,
  },
  {
    id: 4,
    name: "Creative Designers",
    description: "UI/UX and product designers' corner",
    image: "https://picsum.photos/seed/group3/100/100",
    tags: ["Design", "Figma", "UX"],
    category: "Design",
    verified: false,
    members: 670,
  },
  {
    id: 5,
    name: "Flutter Developers",
    description: "Flutter enthusiasts and developers worldwide",
    image: "https://picsum.photos/seed/group5/100/100",
    tags: ["Flutter", "Dart", "Mobile"],
    category: "Technology",
    verified: true,
    members: 13670,
  },
  {
    id: 6,
    name: "Design Inspiration",
    description: "UI/UX and product designers' corner",
    image: "https://picsum.photos/seed/group6/100/100",
    tags: ["UI/UX", "Graphics", "Inspiration"],
    category: "Design",
    verified: true,
    members: 1070,
  },
  {
    id: 7,
    name: "Flutter Developers",
    description: "Flutter enthusiasts and developers worldwide",
    image: "https://picsum.photos/seed/group7/100/100",
    tags: ["Flutter", "Dart", "Mobile"],
    category: "Technology",
    verified: false,
    members: 13670,
  },
  {
    id: 8,
    name: "Tech Africa",
    description: "Lets explore the world of technology ",
    image: "https://picsum.photos/seed/group9/100/100",
    tags: ["AI", "software", "technology"],
    category: "Technology",
    verified: true,
    members: 230670,
  },
  {
    id: 9,
    name: "The Future of AI",
    description: "Everything about AI is here",
    image: "https://picsum.photos/seed/group10/100/100",
    tags: ["AI", "Future", "technology"],
    category: "Technology",
    verified: true,
    members: 9670,
  },
];

const extensions = [
  {
    id: 1,
    name: "AI Assistant",
    description: "Get AI-powered suggestions in chat",
    icon: <MdSmartToy className="text-red-700 text-2xl" />,
    installs: 12500,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Emoji Pack",
    description: "Boost expression with emoji reactions",
    icon: <MdEmojiEmotions className="text-red-700 text-2xl" />,
    installs: 8600,
    rating: 4.2,
  },
  {
    id: 3,
    name: "Meeting Scheduler",
    description: "Schedule calls directly inside chat",
    icon: <MdSchedule className="text-red-700 text-2xl" />,
    installs: 9900,
    rating: 4.8,
  },
  {
    id: 4,
    name: "Polls & Surveys",
    description: "Create polls to gather feedback",
    icon: <MdPoll className="text-red-700 text-2xl" />,
    installs: 1900,
    rating: 4.1,
  },
  {
    id: 5,
    name: "Mini Games",
    description: "Play games with friends in chat",
    icon: <MdGames className="text-red-700 text-2xl" />,
    installs: 900,
    rating: 4.4,
  },
];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [installedIds, setInstalledIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [visibleGroups, setVisibleGroups] = useState(3);

  const handleJoin = (id: number) => {
    setJoinedGroups((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const filteredGroups = groupData.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExtensions = extensions.filter(
    (ext) =>
      ext.name.toLowerCase().includes(search.toLowerCase()) ||
      ext.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleInstall = (id: number) => {
    if (!installedIds.includes(id)) {
      setInstalledIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Spaces
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Join spaces and communities to collaborate and chat
        </p>

        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search spaces, extensions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="hidden sm:flex gap-4 my-8 justify-center">
        <div
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-3 py-2  rounded-full cursor-pointer transition ${
            activeTab === "all"
              ? "bg-red-600 text-white hover:bg-red-700"
              : " bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          }`}
        >
          <span>All</span>
        </div>
        <div
          onClick={() => setActiveTab("spaces")}
          className={`flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition ${
            activeTab === "spaces"
              ? "bg-red-600 text-white hover:bg-red-700"
              : " bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          }`}
        >
          <FaUserFriends
            className={activeTab === "spaces" ? "text-white" : "text-red-500"}
          />
          <span>Find Spaces</span>
        </div>
        <div
          onClick={() => setActiveTab("extensions")}
          className={`flex items-center gap-2 px-3 py-2   rounded-full cursor-pointer transition ${
            activeTab === "extensions"
              ? "bg-red-600 text-white hover:bg-red-700"
              : " bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          }`}
        >
          <FaPuzzlePiece
            className={
              activeTab === "extensions" ? "text-white" : "text-red-500"
            }
          />
          <span>Extensions</span>
        </div>
        <div
          onClick={() => setActiveTab("nearby")}
          className={`flex items-center gap-2 px-3 py-2  rounded-full cursor-pointer transition ${
            activeTab === "nearby"
              ? "bg-red-600 text-white hover:bg-red-700"
              : " bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          }`}
        >
          <FaMapMarkerAlt
            className={activeTab === "nearby" ? "text-white" : "text-red-500"}
          />

          <span>Nearby</span>
        </div>
        <div
          onClick={() => setActiveTab("createSpace")}
          className={`flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition ${
            activeTab === "createSpace"
              ? "bg-red-600 text-white hover:bg-red-700"
              : " bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          }`}
        >
          <FaPlus
            className={
              activeTab === "createSpace" ? "text-white" : "text-red-500"
            }
          />

          <span>Create Space</span>
        </div>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      {(activeTab === "all" || activeTab === "spaces") && (
        <>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trending Spaces
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {filteredGroups.slice(0, visibleGroups).map((group) => (
              <div
                key={group.id}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center text-center"
              >
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-20 h-20 rounded-full mb-3 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {group.name}
                  {group.verified && (
                    <BiBadgeCheck
                      className="text-red-700"
                      title="Verified"
                      aria-label="Verified"
                    />
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {group.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {group.category} • {group.members} members
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {group.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 text-black dark:bg-slate-400 dark:text-black px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleJoin(group.id)}
                  className={`mt-auto px-4 py-1 text-sm font-medium rounded-full flex items-center gap-2 transition-colors ${
                    joinedGroups.includes(group.id)
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {joinedGroups.includes(group.id) ? (
                    <>
                      <FaCheck /> Joined
                    </>
                  ) : (
                    <>
                      <FaPlus /> Join Space
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {visibleGroups < filteredGroups.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleGroups((prev) => prev + 3)}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {(activeTab === "all" || activeTab === "extensions") && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Popular Extensions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredExtensions.map((ext) => (
              <div
                key={ext.id}
                className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <div className="dark:bg-white dark:text-red-700 bg-red-100 text-white p-3 rounded">
                  {ext.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {ext.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {ext.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                    {ext.installs.toLocaleString()} downloads •{" "}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`inline ${
                          ext.rating >= i + 1
                            ? "text-yellow-400"
                            : ext.rating >= i + 0.5
                            ? "text-yellow-300"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleInstall(ext.id)}
                    className={`mt-1 px-3 py-1 text-sm border-2 rounded-full transition ${
                      installedIds.includes(ext.id)
                        ? "bg-red-700 text-white border-red-700"
                        : "text-sm bg-transparent border-slate-500 text-red-700 dark:border-red-100 dark:text-red-700 border-2 rounded-full"
                    }`}
                  >
                    {installedIds.includes(ext.id) ? "Installed" : "Install"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "createSpace" && (
        <div className="mt-10 max-w-2xl mx-auto">
          <CreateSpaceForm />
        </div>
      )}

      {activeTab === "nearby" && (
        <div className="text-center mt-20 text-gray-400 dark:text-gray-500">
          Nearby feature coming soon.
        </div>
      )}

      {filteredGroups.length === 0 &&
        filteredExtensions.length === 0 &&
        search.length > 0 && (
          <p className="text-center text-gray-500 mt-10">
            No matches found for "{search}"
          </p>
        )}
    </div>
  );
}
