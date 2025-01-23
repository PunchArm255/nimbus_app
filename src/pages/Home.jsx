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
      <div className="bg-[#FFDB4D] w-20 flex flex-col justify-between items-center py-6 m-5 rounded-3xl">
        {/* Nimbus Logo */}
        <img src={NimbusLogo} alt="Nimbus Logo" className="w-10 h-10" />
        {/* Settings Icon */}
        <img src={SettingsIcon} alt="Settings" className="w-8 h-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8">
        <div className="flex flex-1 space-x-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-[#544B3D]">Dashboard</h1>

            {/* User Profile Section */}
            <div className="bg-white rounded-3xl shadow p-6 flex items-center space-x-6">
              <img
                src={ProfileIcon}
                alt="Profile Picture"
                className="rounded-full w-16 h-16"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#544B3D]">PunchArm255</h2>
                <p className="text-sm text-[#544B3D]">Newbie</p>
                <div className="space-y-2 mt-4">
                  {["Stat 1", "Stat 2", "Stat 3"].map((stat, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <span>{stat}</span>
                        <span>100%</span>
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
            </div>

            {/* Streak and Badge Sections */}
            <div className="flex space-x-6">
              <div className="bg-white rounded-3xl shadow flex items-center justify-center h-20 w-1/2">
                <img src={StreakIcon} alt="Streak Icon" className="w-8 h-8 mr-4" />
                <span className="text-lg font-bold text-[#544B3D]">Streak</span>
              </div>
              <div className="bg-white rounded-3xl shadow flex items-center justify-center h-20 w-1/2">
                <img src={BadgeIcon} alt="Badge Icon" className="w-8 h-8 mr-4" />
                <span className="text-lg font-bold text-[#544B3D]">Badges</span>
              </div>
            </div>

            {/* Activity Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#544B3D]">Activity</h2>
              <div className="bg-white rounded-3xl shadow h-40"></div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-64 flex flex-col justify-between">
            {/* Spy List Section */}
            <div className="bg-white rounded-3xl shadow p-6 flex-1">
              <h2 className="text-2xl font-bold mb-4 text-[#544B3D]">Spy List</h2>
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
              <p className="text-right mt-4">Total 4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}