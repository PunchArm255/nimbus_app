import React, { useState } from "react";
import NimbusLogo from "../assets/cloud.svg";
import SettingsIcon from "../assets/settings.svg";
import ProfileIcon from "../assets/profile.png";
import StreakIcon from "../assets/streak.svg";
import BadgeIcon from "../assets/badge.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-screen font-['Red_Hat_Display'] text-[#544B3D] bg-[#FAF7EC]">
      {/* Sidebar */}
      <div className="bg-[#FFDB33] w-20 flex flex-col justify-between items-center py-4">
        <img src={NimbusLogo} alt="Nimbus Logo" className="w-10 h-10" />
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="relative"
        >
          <img src={SettingsIcon} alt="Settings" className="w-8 h-8" />
          {showSettings && (
            <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg py-2 px-4 text-sm">
              <div>Language</div>
              <div>Accessibility</div>
              <div>About</div>
            </div>
          )}
        </button>
      </div>

      {/* Middle Section */}
      <div className="flex-grow px-8 py-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-lg mt-1">Good morning, Mohammed!</p>

        {/* Stats Section */}
        <div className="flex mt-6">
          <div className="flex-grow bg-gray-100 rounded-lg p-6">Stats box</div>

          <div className="ml-6 flex flex-col justify-between">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <img src={StreakIcon} alt="Streak" className="w-8 h-8 mb-2" />
              <span>Streak</span>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center mt-4">
              <img src={BadgeIcon} alt="Badge" className="w-8 h-8 mb-2" />
              <span>Badges</span>
            </div>
          </div>
        </div>

        {/* Activity Box */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">Activity</div>
      </div>

      {/* Right Section */}
      <div className="w-80 border-l border-gray-300 px-6 py-6 flex flex-col">
        <div className="flex justify-between items-center">
          <button className="bg-gray-100 rounded-full p-2">
            <img src={BellIcon} alt="Notifications" className="w-6 h-6" />
          </button>
          <img
            src={ProfileIcon}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center bg-gray-100 rounded-lg px-4 py-2">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mr-2" />
          <input
            type="text"
            placeholder="Search for friends"
            className="bg-transparent outline-none flex-grow"
          />
        </div>

        {/* Placeholder Box */}
        <div className="bg-gray-100 rounded-lg flex-grow mt-6">Placeholder</div>
      </div>
    </div>
  );
};

export default Home;
