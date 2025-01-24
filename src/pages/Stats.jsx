import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NimbusLogo from "../assets/cloud.svg";
import SettingsIcon from "../assets/settings.svg";
import ProfileIcon from "../assets/profile.png";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";

const Stats = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedStat, setSelectedStat] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [stats, setStats] = useState([
        { name: "Social", value: 0 },
        { name: "Physical", value: 0 },
        { name: "Lifestyle", value: 0 },
        { name: "Cognitive", value: 0 },
        { name: "Emotional", value: 0 },
    ]);
    const navigate = useNavigate();

    const questions = {
        Social: [
            "How active are you in social gatherings?",
            "How often do you communicate with friends?",
            "How confident are you in networking situations?",
        ],
        Physical: [
            "How often do you exercise?",
            "How would you rate your endurance?",
            "How flexible is your body?",
        ],
        Lifestyle: [
            "How balanced is your work-life routine?",
            "How would you rate your sleep quality?",
            "How healthy is your diet?",
        ],
        Cognitive: [
            "How often do you engage in problem-solving tasks?",
            "How would you rate your focus during work or study?",
            "How quickly do you learn new skills?",
        ],
        Emotional: [
            "How well do you handle stress?",
            "How confident are you in difficult situations?",
            "How aware are you of your emotions?",
        ],
    };

    const levels = ["Not Active", "Beginner", "Intermediate", "Advanced", "Expert"];

    const handleAnswer = (levelIndex) => {
        setSelectedLevel(levelIndex * 20); // Convert level to percentage
    };

    const calculatePercentage = () => {
        if (answers.length === 0) return 0;
        return Math.round(
            answers.reduce((sum, value) => sum + value, 0) / answers.length
        );
    };

    const handleSubmit = () => {
        const percentage = calculatePercentage();
        setStats((prevStats) =>
            prevStats.map((stat) =>
                stat.name === selectedStat ? { ...stat, value: percentage } : stat
            )
        );
        setShowModal(false);
        setSelectedStat(null);
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setSelectedLevel(null);
    };

    return (
        <div className="flex h-screen font-['Red_Hat_Display'] text-[#544B3D] bg-[#FAF7EC] relative">
            {/* Sidebar */}
            <div className="bg-[#FFDB33] w-20 flex flex-col rounded-r-4xl justify-between items-center py-4">
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
            <div className="flex-grow px-8 py-6 flex flex-col h-full">
                <h1 className="text-3xl font-black leading-none">Stats</h1>
                <p className="text-sm font-semibold mt-[-4px]">Manage your stats!</p>

                {/* Stats Section */}
                <div className="flex mt-6 h-full">
                    <div className="flex-grow bg-white rounded-xl p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-black text-2xl leading-none">PunchArm255</div>
                                <div className="font-semibold text-lg mt-[-4px]">Newbie</div>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2"
                            >
                                Manage Stats
                            </button>
                        </div>

                        <div className="mt-3 space-y-3">
                            {stats.map((stat, index) => (
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
                            <button
                                onClick={() => navigate("/home")}
                                className="bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2 mt-4"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div
                        className="bg-white rounded-xl p-6 w-96 transform transition-transform duration-300 animate-zoomIn"
                    >
                        {!selectedStat ? (
                            <>
                                <h2 className="text-xl font-black">Select a Main Stat</h2>
                                <div className="mt-4 space-y-2">
                                    {stats.map((stat, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedStat(stat.name)}
                                            className={`w-full p-3 rounded-xl font-semibold text-left ${selectedStat === stat.name
                                                ? "bg-[#FFDB33]"
                                                : "bg-gray-100 hover:bg-[#FFDB33]"
                                                }`}
                                        >
                                            {stat.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded-xl mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => selectedStat && setCurrentQuestionIndex(0)}
                                        disabled={!selectedStat}
                                        className={`px-4 py-2 rounded-xl ${selectedStat ? "bg-[#FFDB33]" : "bg-gray-300"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-black">{questions[selectedStat][currentQuestionIndex]}</h2>
                                <div className="mt-4 space-y-2">
                                    {levels.map((level, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswer(index)}
                                            className={`w-full p-3 rounded-xl font-semibold text-left ${selectedLevel === index * 20
                                                ? "bg-[#FFDB33]"
                                                : "bg-gray-100 hover:bg-[#FFDB33]"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={() => setSelectedStat(null)}
                                        className="px-4 py-2 bg-gray-300 rounded-xl"
                                    >
                                        Back
                                    </button>
                                    {currentQuestionIndex < questions[selectedStat].length - 1 ? (
                                        <button
                                            onClick={() => {
                                                if (selectedLevel !== null) {
                                                    setAnswers((prev) => [...prev, selectedLevel]);
                                                    setCurrentQuestionIndex((prev) => prev + 1);
                                                    setSelectedLevel(null);
                                                }
                                            }}
                                            disabled={selectedLevel === null}
                                            className={`px-4 py-2 rounded-xl ${selectedLevel !== null ? "bg-[#FFDB33]" : "bg-gray-300"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (selectedLevel !== null) {
                                                    setAnswers((prev) => [...prev, selectedLevel]);
                                                    handleSubmit();
                                                }
                                            }}
                                            disabled={selectedLevel === null}
                                            className={`px-4 py-2 rounded-xl ${selectedLevel !== null ? "bg-[#FFDB33]" : "bg-gray-300"
                                                }`}
                                        >
                                            Finish
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stats;
