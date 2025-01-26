import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NimbusCloud from "../assets/cloud2.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";
import Logout from "../assets/logout.svg";
import { useUser } from "../lib/context/user";
import { Query } from "appwrite";
import { useTheme } from "../lib/context/theme";
import darkSearch from "../assets/darkSearch.svg";
import darkBell from "../assets/darkBell.svg";
import darkLogout from "../assets/darkLogout.svg";
import Credit from "../assets/credit.svg";

const Stats = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStat, setSelectedStat] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [stats, setStats] = useState([
        { name: "Physical", value: 0, subStats: ["Endurance", "Strength", "Speed", "Flexibility", "Coordination"] },
        { name: "Cognitive", value: 0, subStats: ["Memory", "Problem-Solving", "Focus", "Learning Agility", "Creativity"] },
        { name: "Social", value: 0, subStats: ["Communication", "Empathy", "Leadership", "Conflict Resolution", "Networking"] },
        { name: "Emotional", value: 0, subStats: ["Resilience", "Self-Awareness", "Emotional Regulation", "Confidence", "Stress Management"] },
        { name: "Lifestyle", value: 0, subStats: ["Nutrition", "Sleep", "Fitness Routine", "Time Management", "Work-Life Balance"] },
    ]);

    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isExiting, setIsExiting] = useState(false);
    const [exitRoute, setExitRoute] = useState(null);
    const sidebarRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const { current, logout, fetchStats, updateStats, fetchFriends, updateFriends, databases } = useUser();
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        async function loadStats() {
            if (current) {
                const userStats = await fetchStats(current.$id);
                if (userStats) {
                    const parsedStats = JSON.parse(userStats);
                    setStats(parsedStats);
                }
            }
        }
        loadStats();
    }, [current, fetchStats]);

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

    const questions = {
        Physical: [
            { question: "How long can you sustain physical activity without feeling exhausted?", subStat: "Endurance" },
            { question: "How much weight can you comfortably lift or carry?", subStat: "Strength" },
            { question: "How quickly can you complete a short sprint or physical task?", subStat: "Speed" },
            { question: "How easily can you perform stretches or movements requiring a full range of motion?", subStat: "Flexibility" },
            { question: "How well can you perform tasks that require hand-eye coordination, like catching a ball?", subStat: "Coordination" },
        ],
        Cognitive: [
            { question: "How easily can you recall information you learned a week ago?", subStat: "Memory" },
            { question: "How quickly can you find a solution to an unexpected challenge?", subStat: "Problem-Solving" },
            { question: "How long can you concentrate on a task without getting distracted?", subStat: "Focus" },
            { question: "How quickly can you pick up a new skill or concept?", subStat: "Learning Agility" },
            { question: "How often do you come up with original ideas or solutions?", subStat: "Creativity" },
        ],
        Social: [
            { question: "How effectively can you express your thoughts and ideas to others?", subStat: "Communication" },
            { question: "How well can you understand and share the feelings of others?", subStat: "Empathy" },
            { question: "How confidently can you guide a group toward a common goal?", subStat: "Leadership" },
            { question: "How well can you resolve disagreements or misunderstandings?", subStat: "Conflict Resolution" },
            { question: "How easily can you build and maintain professional or personal connections?", subStat: "Networking" },
        ],
        Emotional: [
            { question: "How quickly can you bounce back from setbacks or failures?", subStat: "Resilience" },
            { question: "How well do you understand your own emotions and triggers?", subStat: "Self-Awareness" },
            { question: "How well can you manage your emotions in stressful situations?", subStat: "Emotional Regulation" },
            { question: "How often do you feel assured in your abilities and decisions?", subStat: "Confidence" },
            { question: "How effectively can you handle high-pressure situations?", subStat: "Stress Management" },
        ],
        Lifestyle: [
            { question: "How balanced and healthy is your daily diet?", subStat: "Nutrition" },
            { question: "How consistently do you get 7-8 hours of quality sleep?", subStat: "Sleep" },
            { question: "How regularly do you engage in physical exercise?", subStat: "Fitness Routine" },
            { question: "How effectively do you prioritize and complete tasks?", subStat: "Time Management" },
            { question: "How well do you balance your professional and personal life?", subStat: "Work-Life Balance" },
        ],
    };

    const levels = ["Novice", "Apprentice", "Adept", "Expert", "Master"];

    const handleAnswer = (levelIndex) => {
        setSelectedLevel(levelIndex * 20);
    };

    const calculatePercentage = () => {
        if (answers.length === 0) return 0;
        return Math.round(answers.reduce((sum, value) => sum + value, 0) / answers.length);
    };

    const handleSubmit = async () => {
        const percentage = calculatePercentage();
        const updatedStats = stats.map((stat) =>
            stat.name === selectedStat
                ? {
                    ...stat,
                    value: percentage,
                    lastModified: Date.now()
                }
                : stat
        );
        setStats(updatedStats);

        if (current) {
            await updateStats(current.$id, updatedStats);
        }

        setShowModal(false);
        setSelectedStat(null);
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setSelectedLevel(null);
    };

    const handleLogout = async () => {
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

    return (
        <div style={{ backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" }}>
            <AnimatePresence onExitComplete={handleExitComplete}>
                {!isExiting && (
                    <motion.div
                        key="stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex h-screen font-RedHatDisplay transition-[background] duration-300 ${isDarkMode ? "text-[#F4E5AF] bg-[#1A1A1A]" : "text-[#544B3D] bg-[#FAF7EC]"
                            } overflow-hidden`}
                    >
                        {/* Sidebar - Hidden on Mobile */}
                        <motion.div
                            ref={sidebarRef}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className={`hidden md:flex transition-all duration-300 bg-[#FFDB33] rounded-r-4xl flex flex-col justify-center items-center py-4 hover:shadow-[0_0_12px_rgba(255,219,51,0.6)] ${sidebarExpanded ? "w-40" : "w-9"}`}
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
                            className="flex-grow px-8 py-6 flex flex-col overflow-y-auto md:overflow-y-visible"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <motion.img
                                        src={NimbusCloud}
                                        alt="Nimbus Cloud"
                                        className="w-11 h-11 mr-2 cursor-pointer"
                                        whileHover={{
                                            scale: 1.1,
                                            filter: isDarkMode ? "brightness(1.2)" : "brightness(0.9)",
                                            transition: { duration: 0.3 }
                                        }}
                                        onClick={toggleDarkMode}
                                    />
                                    <div>
                                        <h1 className="text-3xl font-black leading-none">Stats</h1>
                                        <p className="text-sm font-bold mt-[-4px]">Manage your stats!</p>
                                    </div>
                                </div>

                                {/* Hamburger Menu for Mobile */}
                                <div className="md:hidden">
                                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                        </svg>
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                                            <button onClick={() => setShowProfile(true)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
                                            <button onClick={() => setShowNotifications(true)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notifications</button>
                                            <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                                } rounded-xl p-6 mt-6`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-black text-2xl leading-none">{current?.name || "Username"}</div>
                                        <div className="font-semibold text-lg mt-[-4px]">Explorer</div>
                                    </div>
                                    <motion.button
                                        onClick={() => setShowModal(true)}
                                        className="bg-[#FFDB33] font-black text-sm text-[#544B3D] rounded-xl px-4 py-2 cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Manage Stats
                                    </motion.button>
                                </div>

                                <div className="mt-3 space-y-3">
                                    {stats.map((stat, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between font-black text-lg mb-1">
                                                <span>{stat.name}</span>
                                                <span>{stat.value}%</span>
                                            </div>
                                            <div className={`w-full transition-colors duration-300 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-200'} rounded-full h-2`}>
                                                <motion.div
                                                    className="bg-[#FFDB33] h-2 rounded-full"
                                                    style={{ width: `${stat.value}%` }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stat.value}%` }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <motion.button
                                    onClick={() => handleNavigation("/home")}
                                    className="bg-[#F3E6B2] font-black border-2 border-[#FFDB33] text-sm text-[#544B3D] rounded-xl px-4 py-2 cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Return to Home
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Right Section - Hidden on Mobile */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className={`hidden md:flex w-80 border-l-2 transition-colors duration-300 ${isDarkMode
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
                                        className={`transition-colors duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                                            } rounded-xl p-2 w-10 h-10 cursor-pointer`}
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

                            {/* Search Bar */}
                            <motion.div
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

                            {/* Search Results */}
                            {searchQuery.trim() !== "" && (
                                <motion.div
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

                            {/* Friends Box */}
                            <motion.div
                                className={`transition-[background] duration-300 ${isDarkMode ? "bg-[#2F2F2F]" : "bg-white"
                                    } rounded-xl flex-grow p-6 mt-4 font-black text-xl`}
                            >
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
                            </motion.div>
                        </motion.div>

                        {/* Modal */}
                        <AnimatePresence>
                            {showModal && (
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
                                        {!selectedStat ? (
                                            <>
                                                <h2 className="text-xl font-black">Select a Main Stat</h2>
                                                <div className="mt-4 space-y-2">
                                                    {stats.map((stat, index) => (
                                                        <motion.button
                                                            key={index}
                                                            onClick={() => setSelectedStat(stat.name)}
                                                            className={`w-full p-3 rounded-xl font-bold text-left ${selectedStat === stat.name
                                                                ? "bg-[#FFDB33] text-[#544B3D]"
                                                                : isDarkMode
                                                                    ? "bg-[#1A1A1A] hover:bg-[#FFDB33] hover:text-[#544B3D]"
                                                                    : "bg-gray-100 hover:bg-[#FFDB33]"
                                                                } cursor-pointer`}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            {stat.name}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                <div className="flex justify-end mt-6">
                                                    <motion.button
                                                        onClick={() => setShowModal(false)}
                                                        className={`px-4 font-bold py-2 ${isDarkMode ? "bg-[#1A1A1A]" : "bg-gray-300"
                                                            } rounded-xl mr-2 cursor-pointer`}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="text-xl font-black">
                                                    {questions[selectedStat][currentQuestionIndex].question}
                                                </h2>
                                                <div className="mt-4 space-y-2">
                                                    {levels.map((level, index) => (
                                                        <motion.button
                                                            key={index}
                                                            onClick={() => handleAnswer(index)}
                                                            className={`w-full p-3 rounded-xl font-bold text-left ${selectedLevel === index * 20
                                                                ? "bg-[#FFDB33] text-[#544B3D]"
                                                                : isDarkMode
                                                                    ? "bg-[#1A1A1A] hover:bg-[#FFDB33] hover:text-[#544B3D]"
                                                                    : "bg-gray-100 hover:bg-[#FFDB33]"
                                                                } cursor-pointer`}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            {level}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between mt-6">
                                                    <motion.button
                                                        onClick={() => setSelectedStat(null)}
                                                        className={`px-4 py-2 ${isDarkMode ? "bg-[#1A1A1A]" : "bg-gray-300"
                                                            } font-bold rounded-xl cursor-pointer`}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Back
                                                    </motion.button>
                                                    <div className={`${isDarkMode ? "bg-[#1A1A1A]" : "bg-gray-100"
                                                        } rounded-xl px-4 py-2 font-bold`}>
                                                        {questions[selectedStat][currentQuestionIndex].subStat}
                                                    </div>
                                                    {currentQuestionIndex < questions[selectedStat].length - 1 ? (
                                                        <motion.button
                                                            onClick={() => {
                                                                if (selectedLevel !== null) {
                                                                    setAnswers((prev) => [...prev, selectedLevel]);
                                                                    setCurrentQuestionIndex((prev) => prev + 1);
                                                                    setSelectedLevel(null);
                                                                }
                                                            }}
                                                            disabled={selectedLevel === null}
                                                            className={`px-4 py-2 font-bold rounded-xl ${selectedLevel !== null
                                                                ? "bg-[#FFDB33] text-[#544B3D]"
                                                                : isDarkMode
                                                                    ? "bg-[#1A1A1A]"
                                                                    : "bg-gray-300"
                                                                } cursor-pointer`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Next
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            onClick={() => {
                                                                if (selectedLevel !== null) {
                                                                    setAnswers((prev) => [...prev, selectedLevel]);
                                                                    handleSubmit();
                                                                }
                                                            }}
                                                            disabled={selectedLevel === null}
                                                            className={`px-4 py-2 font-bold rounded-xl ${selectedLevel !== null
                                                                ? "bg-[#FFDB33] text-[#544B3D]"
                                                                : isDarkMode
                                                                    ? "bg-[#1A1A1A]"
                                                                    : "bg-gray-300"
                                                                } cursor-pointer`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Finish
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </>
                                        )}
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

export default Stats;