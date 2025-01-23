import React from "react";
import NimbusLogo from "../assets/cloud.svg";
import SettingsIcon from "../assets/settings.svg";
import ProfileIcon from "../assets/profile.png";
import StreakIcon from "../assets/streak.svg";
import BadgeIcon from "../assets/badge.svg";

export default function Home() {
  return (
    <div className="flex h-screen bg-[#FFF8DE] font-redHat">
      {/* Sidebar */}
      <div className="bg-[#FFDB4D] w-23 flex flex-col justify-between items-center py-6 m-5 rounded-3xl">
        {/* Nimbus Logo */}
        <img src={NimbusLogo} alt="Nimbus Logo" className="w-10 h-10" />
        {/* Settings Icon */}
        <img src={SettingsIcon} alt="Settings" className="w-8 h-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex p-8">
        {/* Left Section (Profile, Streak/Badges, Activity) */}
        <div className="flex flex-col flex-1 space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-[#544B3D]">Dashboard</h1>
          <div className="flex flex-1 space-x-6">
            {/* User Profile Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 flex-1 flex flex-col h-[350px]">
              <div className="flex items-center space-x-4">
                <img
                  src={ProfileIcon}
                  alt="Profile Picture"
                  className="rounded-full w-12 h-12"
                />
                <div>
                  <h2 className="text-lg font-bold text-[#544B3D]">PunchArm255</h2>
                  <p className="text-sm text-[#544B3D]">Newbie</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {["Fitness", "Education", "Soft Skills", "Hard Skills", "Hobbies"].map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#544B3D]">{stat}</span>
                      <span className="text-xl font-bold text-[#544B3D]">100%</span>
                    </div>
                    <div className="h-2 bg-[#FFF8DE] rounded-full">
                      <div
                        className="h-2 bg-[#544B3D] rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak and Badge Sections */}
            <div className="space-y-6 w-[180px]">
              <div className="bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center h-41">
                <img src={StreakIcon} alt="Streak Icon" className="w-20 h-20" />
                <span className="text-3xl font-bold text-[#544B3D]">Streak</span>
              </div>
              <div className="bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center h-41">
                <img src={BadgeIcon} alt="Badge Icon" className="w-20 h-20" />
                <span className="text-3xl font-bold text-[#544B3D]">Badges</span>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#544B3D]">Activity</h1>
            <div className="bg-white rounded-3xl shadow-xl h-70"></div>
          </div>
        </div>

        {/* Spy List Section (Right Side) */}
        <div className="w-1/6 ml-6">
        <h2 className="text-4xl font-bold text-[#544B3D]">Spy List</h2>
          <div className="bg-white rounded-3xl shadow-xl p-6 h-[94.5%] mt-4 flex flex-col justify-between">
            <div>
              <ul className="space-y-4">
                {["BloodyBry", "KENTO", "KENIYSN", "mounir"].map((spy, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#544B3D] rounded-full"></div>
                    <div>
                      <p className="font-bold text-[#544B3D]">{spy}</p>
                      <p className="text-sm text-[#544B3D]">Newbie</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-right mt-4">Total 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}