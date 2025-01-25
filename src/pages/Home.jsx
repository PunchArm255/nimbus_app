import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NimbusCloud from "../assets/cloud2.svg";
import SettingsIcon from "../assets/settings.svg";
import StreakIcon from "../assets/streak.svg";
import BadgeIcon from "../assets/badge.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";
import Logout from "../assets/logout.svg";
import { useUser } from "../lib/context/user";

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [topStats, setTopStats] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { current, logout } = useUser();

  // Close sidebar if click is outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load stats from localStorage
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("stats")) || [];
    const sortedStats = stats.sort((a, b) => b.value - a.value).slice(0, 3);
    setTopStats(sortedStats);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen font-RedHatDisplay text-[#544B3D] bg-[#FAF7EC]">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`transition-all duration-300 bg-[#FFDB33] rounded-r-4xl flex flex-col justify-between items-center py-4 hover:shadow-[0_0_12px_rgba(255,219,51,0.6)] ${sidebarExpanded ? "w-40" : "w-10"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          setSidebarExpanded(!sidebarExpanded);
        }}
      >
        {/* Add content here if needed */}
      </div>

      {/* Middle Section */}
      <div className="flex-grow px-8 py-6">
        <div className="flex items-center">
          <img src={NimbusCloud} alt="Nimbus Cloud" className="w-11 h-11 mr-2" />
          <div>
            <h1 className="text-3xl font-black leading-none">Dashboard</h1>
            <p className="text-sm font-bold mt-[-4px]">
              Good morning, {current?.name || "User"}! {/* Fetch name from Auth */}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex mt-6">
          <div className="flex-grow bg-white rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-black text-2xl leading-none">
                  {current?.name || "Username"} {/* Fetch name from Auth */}
                </div>
                <div className="font-semibold text-lg mt-[-4px]">Newbie</div>
              </div>
              <button
                onClick={() => navigate("/Stats")}
                className="bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2"
              >
                View All
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {topStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between font-black text-lg mb-1">
                    <span>{stat.name}</span>
                    <span>{stat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FFDB33] h-2 rounded-full"
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ml-6 flex flex-col justify-between">
            <div className="bg-white rounded-xl p-4 text-xl flex flex-col items-center font-black w-30 h-30">
              <img src={StreakIcon} alt="Streak" className="w-15 h-15" />
              <span>Streak</span>
            </div>
            <div className="bg-white rounded-xl p-4 text-xl flex flex-col items-center mt-4 font-black w-30 h-30">
              <img src={BadgeIcon} alt="Badge" className="w-15 h-15" />
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
          <button
            onClick={handleLogout}
            className="bg-white rounded-xl p-2 w-10 h-10"
          >
            <img src={Logout} alt="Logout" className="w-6 h-6" />
          </button>
          <button className="bg-white rounded-xl p-2 w-10 h-10 border-2 border-[#FFDB33]">
            {current && (
              <img
                src={`https://cloud.appwrite.io/v1/avatars/initials?name=${current?.name || "User"
                  }&width=40&height=40`}
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center bg-white rounded-xl px-4 py-2 h-11">
          <img src={SearchIcon} alt="Search" className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search for friends"
            className="bg-transparent outline-none flex-grow font-semibold text-sm"
          />
        </div>

        {/* Friends Box */}
        <div className="bg-white rounded-xl flex-grow p-6 mt-4 font-black text-xl">
          Friends
        </div>
      </div>
    </div>
  );
};

export default Home;