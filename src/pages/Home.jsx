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
            <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-xl py-2 px-4 text-sm">
              <div>Language</div>
              <div>Accessibility</div>
              <div>About</div>
            </div>
          )}
        </button>
      </div>

      {/* Middle Section */}
      <div className="flex-grow px-8 py-6">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-sm font-semibold">Good morning, Mohammed!</p>

        {/* Stats Section */}
        <div className="flex mt-6">
          <div className="flex-grow bg-white rounded-xl p-6 font-black text-xl">PunchArm255</div>

          <div className="ml-6 flex flex-col justify-between">
            <div className="bg-white rounded-xl p-4 flex flex-col items-center font-black">
              <img src={StreakIcon} alt="Streak" className="w-10 h-10" />
              <span>Streak</span>
            </div>

            <div className="bg-white rounded-xl p-4 flex flex-col items-center mt-4 font-black">
              <img src={BadgeIcon} alt="Badge" className="w-10 h-10" />
              <span>Badges</span>
            </div>
          </div>
        </div>

        {/* Activity Box */}
        <div className="bg-white rounded-xl p-6 mt-6 font-black text-xl">Activity</div>
      </div>

      {/* Right Section */}
      <div className="w-80 border-l-2 border-[#D3CFC3] px-6 py-6 flex flex-col">
        <div className="flex justify-between items-center">
          <button className="bg-white rounded-xl p-2 w-10 h-10">
            <img src={BellIcon} alt="Notifications" className="w-6 h-6" />
          </button>
          <img
            src={ProfileIcon}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center bg-[white] rounded-xl px-4 py-2 h-11">
          <img src={SearchIcon} alt="Search" className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search for friends"
            className="bg-transparent outline-none flex-grow font-semibold text-sm"
          />
        </div>

        {/* Friends Box */}
        <div className="bg-white rounded-xl flex-grow p-6 mt-4 font-black text-xl">Friends</div>
      </div>
    </div>
  );
};

export default Home;
