import React, { useState } from "react";

const tabs = ["Overview", "Personal Info", "Privacy & Security", "Devices"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = () => {
    alert(`Password changed to: ${newPassword}`);
    setNewPassword("");
    setShowPasswordForm(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome, Iddrisu Sulemana👋
            </h2>
            <p>Email: sulemana@gmail.com</p>
            <p>Member since: Jan 2023</p>
          </div>
        );
      case "Personal Info":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p>Name: Iddrisu Sulemana</p>
            <p>Phone: +233 (555) 123-4567</p>
            <p>Address: Pagsara RD, Tamale</p>
          </div>
        );
      case "Privacy & Security":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Privacy & Security</h2>
            <p>
              Password: ********{" "}
              <button
                className="text-blue-600 ml-2 underline"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Cancel" : "Change"}
              </button>
            </p>

            {showPasswordForm && (
              <div className="mt-2 space-y-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="p-2 border rounded w-full text-black"
                />
                <button
                  onClick={handlePasswordChange}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Password
                </button>
              </div>
            )}

            <p className="mt-4">
              Two-factor auth: <span className="font-medium">Enabled</span>
            </p>
            <p>
              Login alerts: <span className="font-medium">On</span>
            </p>
          </div>
        );
      case "Devices":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Connected Devices</h2>
            <ul className="list-disc ml-5">
              <li>MacBook Pro - Last seen: 2 days ago</li>
              <li>iPhone 14 - Active now</li>
              <li>Samsung Tablet - Last seen: 1 week ago</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Profile Settings
        </h1>

        <div className="flex gap-4 mb-6 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setShowPasswordForm(false); // Reset on tab change
              }}
              className={`px-4 py-2 rounded-t-md font-medium ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md text-gray-800 dark:text-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
