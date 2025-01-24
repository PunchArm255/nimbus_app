import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NimbusLogo from "../assets/cloud.svg";
import SettingsIcon from "../assets/settings.svg";
import ProfileIcon from "../assets/profile.png";
import StreakIcon from "../assets/streak.svg";
import BadgeIcon from "../assets/badge.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";

const Stats = () => {
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="flex h-screen font-['Red_Hat_Display'] text-[#544B3D] bg-[#FAF7EC]">
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
                                onClick={() => navigate("/stats")}
                                className="bg-[#FFDB33] font-black text-sm rounded-xl px-4 py-2"
                            >
                                View All
                            </button>
                        </div>

                        <div className="mt-3 space-y-3">
                            <div>
                                <div className="flex justify-between font-black text-lg mb-1">
                                    <span>Stat 1</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#FFDB33] h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between font-black text-lg mb-1">
                                    <span>Stat 2</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#FFDB33] h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between font-black text-lg mb-1">
                                    <span>Stat 3</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#FFDB33] h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between font-black text-lg mb-1">
                                    <span>Stat 4</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#FFDB33] h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between font-black text-lg mb-1">
                                    <span>Stat 5</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#FFDB33] h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
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
        </div>
    );
};

export default Stats;