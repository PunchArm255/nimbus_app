import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { toPng } from "html-to-image";
import NimbusCloud from "../assets/cloud2.svg";
import StreakIcon from "../assets/streak.svg";
import BadgeIcon from "../assets/badge.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";
import Logout from "../assets/logout.svg";
import darkStreak from "../assets/darkStreak.svg";
import darkBadge from "../assets/darkBadge.svg";
import darkSearch from "../assets/darkSearch.svg";
import darkBell from "../assets/darkBell.svg";
import darkLogout from "../assets/darkLogout.svg";
import Credit from "../assets/credit.svg";
import { useUser } from "../lib/context/user";
import { Query } from "appwrite";
import { useTheme } from "../lib/context/theme";
import PostPreview from "./PostPreview";

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
  const [isExiting, setIsExiting] = useState(false);
  const [exitRoute, setExitRoute] = useState(null);
  const exportRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [statsFilter, setStatsFilter] = useState('top');

  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { current, logout, fetchStats, fetchFriends, updateFriends, databases } = useUser();
  const controls = useAnimation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const previewRef = useRef(null);

  useEffect(() => {
    async function loadTopStats() {
      if (current) {
        const userStats = await fetchStats(current.$id);
        if (userStats) {
          const parsedStats = JSON.parse(userStats);
          let filteredStats;

          if (statsFilter === 'top') {
            filteredStats = parsedStats.sort((a, b) => b.value - a.value).slice(0, 3);
          } else {
            filteredStats = parsedStats
              .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
              .slice(0, 3);
          }

          setTopStats(filteredStats);
          controls.start({
            width: "100%",
            transition: { duration: 1, ease: "easeInOut" },
          });
        }
      }
    }
    loadTopStats();
  }, [current, fetchStats, controls, statsFilter]);

  useEffect(() => {
    async function loadFriends() {
      if (current) {
        const friendsList = await fetchFriends(current.$id);
        const friendsWithNames = await Promise.all(
          friendsList.map(async (friendID) => {
            const friend = await databases.getDocument(
              "67953c900037179cefda",
              "67953ca0003a82974731",
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

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await databases.listDocuments(
        "67953c900037179cefda",
        "67953ca0003a82974731",
        [Query.search("name", searchQuery)]
      );
      const filteredResults = response.documents.filter(
        (user) => user.$id !== current.$id && !friends.some((friend) => friend.id === user.$id)
      );
      setSearchResults(filteredResults);
    } catch (err) {
      console.error("Error searching for users:", err);
    }
  };

  const handleFollow = async (friendID, friendName) => {
    try {
      const updatedFriends = [...friends, { id: friendID, name: friendName }];
      setFriends(updatedFriends);
      await updateFriends(current.$id, updatedFriends.map((f) => f.id));
      setSearchResults((prev) => prev.filter((user) => user.$id !== friendID));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnfollow = async (friendID) => {
    try {
      const updatedFriends = friends.filter((friend) => friend.id !== friendID);
      setFriends(updatedFriends);
      await updateFriends(current.$id, updatedFriends.map((f) => f.id));
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

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

  const handleLogout = () => {
    setExitRoute("logout");
    setIsExiting(true);
  };

  const handleNavigation = (route) => {
    setExitRoute(route);
    setIsExiting(true);
  };

  const handleExitComplete = async () => {
    if (isExiting && exitRoute) {
      if (exitRoute === "logout") {
        await logout();
        navigate("/");
      } else {
        navigate(exitRoute);
      }
    }
  };

  const handleInstantExport = async () => {
    if (previewRef.current) {
      try {
        const scale = 1080 / previewRef.current.offsetWidth;
        const dataUrl = await toPng(previewRef.current, {
          width: 1080,
          height: 1080,
          quality: 1,
          pixelRatio: 2,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          },
        });
        const link = document.createElement("a");
        link.download = "nimbus_stats_post.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error exporting image:", error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" }}>
      <AnimatePresence onExitComplete={handleExitComplete}>
        {!isExiting && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex h-screen font-RedHatDisplay transition-[background] duration-300 ${isDarkMode ? "text-[#F4E5AF] bg-[#1A1A1A]" : "text-[#544B3D] bg-[#FAF7EC]"
              } overflow-hidden`}
          >
            {/* Sidebar */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`transition-all duration-300 bg-[#FFDB33] rounded-r-4xl flex flex-col justify-center items-center py-4 hover:shadow-[0_0_12px_rgba(255,219,51,0.6)] ${sidebarExpanded ? "w-40" : "w-9"}`}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarExpanded(!sidebarExpanded);
              }}
            >
              <AnimatePresence>
                {sidebarExpanded && (
                  <motion.img
                    src={Credit}
                    alt="Credit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-30 h-30"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Middle Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex-grow px-8 py-6"
            >
              <div className="flex items-center">
                <motion.img
                  src={NimbusCloud}
                  alt="Nimbus Cloud"
                  className="w-11 h-11 mr-2 cursor-pointer"
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                  onClick={toggleDarkMode}
                />
                <div>
                  <h1 className="text-3xl font-black leading-none">Dashboard</h1>
                  <p className="text-sm font-bold mt-[-4px]">
                    Welcome back, {current?.name || "User"}!
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex mt-6">
                <div className={`flex-grow transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                  } rounded-xl p-6`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-black text-2xl leading-none">
                        {current?.name || "Username"}
                      </div>
                      <div className="font-semibold text-lg mt-[-4px]">Explorer</div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setStatsFilter(statsFilter === 'top' ? 'recent' : 'top')}
                        className={`${isDarkMode ? 'shadow-black/25' : 'shadow-amber-100'} bg-[#F3E6B2] text-[#544B3D] shadow-lg font-black text-sm rounded-xl px-4 py-2 cursor-pointer`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {statsFilter === 'top' ? 'Top 3 Stats' : 'Recent'}
                      </motion.button>
                      <motion.button
                        onClick={() => handleNavigation("/Stats")}
                        className={`${isDarkMode ? 'shadow-black/25' : 'shadow-amber-100'} bg-[#FFDB33] text-[#544B3D] shadow-lg font-black text-sm rounded-xl px-4 py-2 cursor-pointer`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    {topStats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between font-black text-lg mb-1">
                          <span>{stat.name}</span>
                          <span>{stat.value}%</span>
                        </div>
                        <div className={`w-full transition-colors duration-300 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-200'} rounded-full h-2 overflow-hidden`}>
                          <motion.div
                            className="bg-[#FFDB33] h-2 rounded-full"
                            style={{ width: `${stat.value}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ml-6 flex flex-col justify-between">
                  <motion.button
                    onClick={() => setShowStreakModal(true)}
                    className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                      } rounded-xl p-4 text-xl flex flex-col items-center font-black w-30 h-30 cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={isDarkMode ? darkStreak : StreakIcon}
                      alt="Streak"
                      className="w-15 h-15 transition-all duration-300"
                    />
                    <span>Streak</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowBadgesModal(true)}
                    className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                      } rounded-xl p-4 text-xl flex flex-col items-center mt-4 font-black w-30 h-30 cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={isDarkMode ? darkBadge : BadgeIcon}
                      alt="Badge"
                      className="w-15 h-15 transition-all duration-300"
                    />
                    <span>Badges</span>
                  </motion.button>
                </div>
              </div>

              {/* Export Box */}
              <div className={`flex-grow transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"} rounded-xl p-6 mt-6`}>
                <div className="flex justify-between items-center">
                  <div className="font-black text-2xl leading-none">Share with friends</div>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => navigate("/PostPreview")}
                      className={`bg-[#FFDB33] text-[#544B3D] ${isDarkMode ? 'shadow-black/25' : 'shadow-amber-100'} shadow-lg font-black text-sm rounded-xl px-4 py-2 cursor-pointer`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Preview
                    </motion.button>
                    <motion.button
                      onClick={handleInstantExport}
                      className={`bg-[#FFDB33] text-[#544B3D] ${isDarkMode ? 'shadow-black/25' : 'shadow-amber-100'} shadow-lg font-black text-sm rounded-xl px-4 py-2 cursor-pointer`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Export Post
                    </motion.button>
                  </div>
                </div>

                {/* Hidden Preview Content for Export */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                  <div ref={previewRef}>
                    <PostPreview />
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Right Section */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className={`w-80 border-l-2 transition-colors duration-300 ${isDarkMode
                ? "border-[#2F2F2F]"
                : "border-[#D3CFC3]"
                } px-6 py-6 flex flex-col`}
            >
              <div className="flex justify-between items-center">
                <motion.button
                  onClick={() => setShowProfile(true)}
                  className="bg-white rounded-xl w-10 h-10 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {current && (
                    <img
                      src={`https://cloud.appwrite.io/v1/avatars/initials?name=${current?.name || "User"}&width=40&height=40`}
                      alt="Profile"
                      className="w-10 h-10 border-[#FFDB33] border-2 rounded-xl"
                    />
                  )}
                </motion.button>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setShowNotifications(true)}
                    className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"} rounded-xl p-2 w-10 h-10 cursor-pointer`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={isDarkMode ? darkBell : BellIcon}
                      alt="Notifications"
                      className="w-6 h-6 transition-all duration-300"
                    />
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"} rounded-xl p-2 w-10 h-10 cursor-pointer`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={isDarkMode ? darkLogout : Logout}
                      alt="Logout"
                      className="w-6 h-6 transition-all duration-300"
                    />
                  </motion.button>
                </div>
              </div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={`mt-6 flex items-center transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                  } rounded-xl px-4 py-2 h-11`}
              >
                <img
                  src={isDarkMode ? darkSearch : SearchIcon}
                  alt="Search"
                  className="w-5 h-5 mr-2 transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Search for friends"
                  className={`bg-transparent outline-none flex-grow font-semibold text-sm ${isDarkMode ? "text-[#F4E5AF] placeholder-[#F4E5AF]/50" : "text-[#544B3D] placeholder-[#544B3D]/50"
                    }`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch();
                  }}
                />
              </motion.div>

              {searchQuery.trim() !== "" && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                    } rounded-xl p-4 mt-4`}
                >
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
                </motion.div>
              )}

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className={`transition-[background] duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                  } rounded-xl flex-grow p-6 mt-4 font-black text-xl`}
              >
                <h2 className="font-black text-lg mb-2">Friends</h2>
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <motion.div
                      key={friend.id}
                      className="flex justify-between items-center mb-3 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{friend.name}</span>
                      <motion.button
                        onClick={() => handleUnfollow(friend.id)}
                        className="bg-red-500 text-white font-bold text-sm rounded-xl px-2 py-1 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm">No friends yet.</p>
                )}
              </motion.div>
            </motion.div>

            {/* Streak Modal */}
            <AnimatePresence>
              {showStreakModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`fixed inset-0 ${isDarkMode
                    ? "bg-black bg-opacity-40"
                    : "bg-white bg-opacity-40"
                    } backdrop-blur-sm flex items-center justify-center z-50`}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                      } rounded-xl p-6 w-96`}
                  >
                    <h2 className="text-xl font-black mb-4">Streak</h2>
                    <p className="text-lg">
                      Your current streak is: <span className="font-bold">1 day</span>
                    </p>
                    <motion.button
                      onClick={() => setShowStreakModal(false)}
                      className="mt-4 bg-[#FFDB33] text-[#544B3D] font-black text-sm rounded-xl px-4 py-2 cursor-pointer"
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
                  className={`fixed inset-0 ${isDarkMode
                    ? "bg-black bg-opacity-40"
                    : "bg-white bg-opacity-40"
                    } backdrop-blur-sm flex items-center justify-center z-50`}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                      } rounded-xl p-6 w-96`}
                  >
                    <h2 className="text-xl font-black mb-4">Badge List</h2>
                    <div className="space-y-2">
                      {["Explorer", "Achiever", "Streaker", "Socializer", "Master"].map(
                        (badge, index) => (
                          <motion.div
                            key={index}
                            className={`flex items-center ${isDarkMode ? "bg-[#1A1A1A]" : "bg-gray-100"
                              } rounded-xl p-3 cursor-pointer`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="font-semibold">{badge}</span>
                          </motion.div>
                        )
                      )}
                    </div>
                    <motion.button
                      onClick={() => setShowBadgesModal(false)}
                      className="mt-4 bg-[#FFDB33] text-[#544B3D] font-black text-sm rounded-xl px-4 py-2 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Modal */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-24 right-72 z-50 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                    } rounded-xl p-4 shadow-lg w-64`}
                >
                  <div className="font-semibold mb-2">Currently signed in as:</div>
                  <div className="font-black">{current?.name || "User"}</div>
                  <motion.button
                    onClick={() => setShowProfile(false)}
                    className="mt-4 bg-[#FFDB33] text-[#544B3D] font-black text-sm rounded-xl px-4 py-2 w-full cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications Modal */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-24 right-32 z-50 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                    } rounded-xl p-4 shadow-lg w-64`}
                >
                  <div className="font-black mb-2">Notifications</div>
                  <div className="text-sm opacity-70">No new notifications</div>
                  <motion.button
                    onClick={() => setShowNotifications(false)}
                    className="mt-4 bg-[#FFDB33] text-[#544B3D] font-black text-sm rounded-xl px-4 py-2 w-full cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;