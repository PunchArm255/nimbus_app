import React, { useRef, useEffect, useState } from "react";
import { useUser } from "../lib/context/user";
import { toPng } from "html-to-image";
import Logo from "../assets/logo.svg"; // Updated logo import
import PostBackground from "../assets/post_background.png";

const PostPreview = () => {
    const { current, fetchStats } = useUser();
    const postRef = useRef(null);
    const [stats, setStats] = useState([]);

    // Fetch stats for the logged-in user
    useEffect(() => {
        const loadStats = async () => {
            if (current) {
                const userStats = await fetchStats(current.$id);
                if (userStats) {
                    const parsedStats = JSON.parse(userStats);
                    setStats(parsedStats);
                }
            }
        };
        loadStats();
    }, [current, fetchStats]);

    // Function to export the post as a PNG
    const handleExport = async () => {
        if (postRef.current) {
            try {
                // Scale the element to ensure consistent dimensions
                const scale = 1080 / postRef.current.offsetWidth;
                const dataUrl = await toPng(postRef.current, {
                    width: 1080,
                    height: 1080,
                    quality: 1,
                    pixelRatio: 2, // For higher resolution
                    style: {
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    },
                });

                // Create a download link
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF7EC] p-4 font-['Red_Hat_Display']">
            {/* Post Preview */}
            <div
                ref={postRef}
                className="relative w-[1080px] h-[1080px] flex flex-col items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${PostBackground})` }}
            >
                {/* Nimbus Logo */}
                <img src={Logo} alt="Nimbus Logo" className="w-50 mb-2" />

                {/* "Your IRL Stats:" Text */}
                <h1 className="text-6xl font-black text-[#544B3D] mb-8">Your IRL Stats:</h1>

                {/* Stats Box */}
                <div className="bg-white rounded-3xl p-12 w-[800px] h-[600px] shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <div className="font-black text-6xl text-[#544B3D] leading-none">
                                {current?.name || "Username"}
                            </div>
                            <div className="font-semibold text-2xl mt-[-4px] text-[#544B3D]">Newbie</div>
                        </div>
                    </div>

                    {/* Stats Progress Bars */}
                    <div className="space-y-4">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <div className="flex justify-between font-black text-[#544B3D] text-3xl mb-3">
                                    <span>{stat.name}</span>
                                    <span>{stat.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-[#FFDB33] h-3 rounded-full"
                                        style={{ width: `${stat.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marketing Text */}
                <p className="text-2xl font-bold text-[#544B3D] mt-8">
                    Try at mynimbus.vercel.app
                </p>
            </div>

            {/* Export Button */}
            <button
                onClick={handleExport}
                className="mt-8 bg-[#FFDB33] font-black text-lg rounded-xl px-6 py-3 cursor-pointer"
            >
                Export as PNG
            </button>
        </div>
    );
};

export default PostPreview;