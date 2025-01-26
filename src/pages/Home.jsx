import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import NimbusCloud from "../assets/cloud2.svg";
import SettingsIcon from "../assets/settings.svg";
import StreakIcon from "../assets/streak.svg";
import BadgeIcon from "../assets/badge.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";
import Logout from "../assets/logout.svg";
import { useUser } from "../lib/context/user";
import { Query } from "appwrite";

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [topStats, setTopStats] = useState([
    { name: "Physical", value: 0 },
    { name: "Cognitive", value: 0 },
    { name: "Social", value: 0 },
  ]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { current, logout, fetchStats, fetchFriends, updateFriends, databases } = useUser();

  // Fetch top stats from Appwrite
  useEffect(() => {
    async function loadTopStats() {
      if (current) {
        const userStats = await fetchStats(current.$id);
        if (userStats) {
          const parsedStats = JSON.parse(userStats);
          const sortedStats = parsedStats
            .sort((a, b) => b.value - a.value)
            .slice(0, 3);
          setTopStats(sortedStats);
        }
      }
    }
    loadTopStats();
  }, [current, fetchStats]);

  // Fetch friends list from Appwrite
  useEffect(() => {
    async function loadFriends() {
      if (current) {
        const friendsList = await fetchFriends(current.$id);
        const friendsWithNames = await Promise.all(
          friendsList.map(async (friendID) => {
            const friend = await databases.getDocument(
              "67953c900037179cefda", // Database ID
              "67953ca0003a82974731", // Users Collection ID
              friendID
            );
            return { id: friendID, name: friend.name };
          })
        );
        setFriends(friendsWithNames);
      }
    }
    loadFriends();
  }, [current, fetchFriends, databases]);

  // Handle search for friends
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await databases.listDocuments(
        "67953c900037179cefda", // Database ID
        "67953ca0003a82974731", // Users Collection ID
        [Query.search("name", searchQuery)]
      );

      const filteredResults = response.documents.filter(
        (user) =>
          user.$id !== current.$id &&
          !friends.some((friend) => friend.id === user.$id)
      );

      setSearchResults(filteredResults);
    } catch (err) {
      console.error("Error searching for users:", err);
    }
  };

  // Handle follow a friend
  const handleFollow = async (friendID, friendName) => {
    try {
      const updatedFriends = [...friends, { id: friendID, name: friendName }];
      setFriends(updatedFriends);
      await updateFriends(
        current.$id,
        updatedFriends.map((friend) => friend.id)
      );
      setSearchResults((prev) => prev.filter((user) => user.$id !== friendID));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  // Handle unfollow a friend
  const handleUnfollow = async (friendID) => {
    try {
      const updatedFriends = friends.filter((friend) => friend.id !== friendID);
      setFriends(updatedFriends);
      await updateFriends(
        current.$id,
        updatedFriends.map((friend) => friend.id)
      );
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

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
              Good morning, {current?.name || "User"}!
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex mt-6">
          <div className="flex-grow bg-white rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-black text-2xl leading-none">
                  {current?.name || "Username"}
                </div>
                <div className="font-semibold text-lg mt-[-4px]">Newbie</div>
              </div>
              <motion.button
                onClick={() => navigate("/Stats")}
                className="bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
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
            {/* Streak Button */}
            <motion.button
              onClick={() => setShowStreakModal(true)}
              className="bg-white rounded-xl p-4 text-xl flex flex-col items-center font-black w-30 h-30 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={StreakIcon} alt="Streak" className="w-15 h-15" />
              <span>Streak</span>
            </motion.button>

            {/* Badges Button */}
            <motion.button
              onClick={() => setShowBadgesModal(true)}
              className="bg-white rounded-xl p-4 text-xl flex flex-col items-center mt-4 font-black w-30 h-30 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={BadgeIcon} alt="Badge" className="w-15 h-15" />
              <span>Badges</span>
            </motion.button>
          </div>
        </div>

        {/* Activity Box */}
        <div className="bg-white rounded-xl p-6 mt-6 font-black text-xl">Activity</div>
      </div>

      {/* Right Section */}
      <div className="w-80 border-l-2 border-[#D3CFC3] px-6 py-6 flex flex-col">
        <div className="flex justify-between items-center">
          <motion.button
            className="bg-white rounded-xl p-2 w-10 h-10 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={BellIcon} alt="Notifications" className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={handleLogout}
            className="bg-white rounded-xl p-2 w-10 h-10 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={Logout} alt="Logout" className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="bg-white rounded-xl p-2 w-10 h-10 border-2 border-[#FFDB33] cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {current && (
              <img
                src={`https://cloud.appwrite.io/v1/avatars/initials?name=${current?.name || "User"
                  }&width=40&height=40`}
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center bg-white rounded-xl px-4 py-2 h-11">
          <img src={SearchIcon} alt="Search" className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search for friends"
            className="bg-transparent outline-none flex-grow font-semibold text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch();
            }}
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() !== "" && (
          <div className="bg-white rounded-xl p-4 mt-4">
            <h2 className="font-black text-lg mb-2">Search Results</h2>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <motion.div
                  key={user.$id}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{user.name}</span>
                  <motion.button
                    onClick={() => handleFollow(user.$id, user.name)}
                    className="bg-[#FFDB33] font-black text-sm rounded-xl px-3 py-1 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Follow
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className="text-sm">No results found.</p>
            )}
          </div>
        )}

        {/* Friends Box */}
        <div className="bg-white rounded-xl flex-grow p-6 mt-4 font-black text-xl">
          <h2 className="font-black text-lg mb-2">Friends</h2>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <motion.div
                key={friend.id}
                className="flex justify-between items-center mb-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{friend.name}</span>
                <motion.button
                  onClick={() => handleUnfollow(friend.id)}
                  className="bg-red-500 text-white font-black text-sm rounded-xl px-3 py-1 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Unfollow
                </motion.button>
              </motion.div>
            ))
          ) : (
            <p className="text-sm">No friends yet.</p>
          )}
        </div>
      </div>

      {/* Streak Modal */}
      <AnimatePresence>
        {showStreakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96"
            >
              <h2 className="text-xl font-black mb-4">Streak</h2>
              <p className="text-lg">Your current streak is: <span className="font-bold">5 days</span></p>
              <motion.button
                onClick={() => setShowStreakModal(false)}
                className="mt-4 bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges Modal */}
      <AnimatePresence>
        {showBadgesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96"
            >
              <h2 className="text-xl font-black mb-4">Badge List</h2>
              <div className="space-y-2">
                {["Explorer", "Achiever", "Streaker", "Socializer", "Master"].map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-xl p-3 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-semibold">{badge}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => setShowBadgesModal(false)}
                className="mt-4 bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;