import React from "react";
import { useNavigate } from "react-router-dom";
import NimbusLogo from "../assets/nimbus_light.svg";

function Welcome() {
    const navigate = useNavigate();

    const handleNavigation = (route) => {
        document.body.style.transition = "background-color 0.5s ease";
        document.body.style.backgroundColor = "#FAF7EC";
        setTimeout(() => navigate(route), 500);
    };

    return (
        <div className="h-screen bg-[#FFDB4D] flex flex-col justify-center items-center font-['Red_Hat_Display'] text-[#544B3D]">
            <img src={NimbusLogo} alt="Nimbus Logo" className="w-100 h-30" />
            <button
                onClick={() => handleNavigation("/signin")}
                className="mt-8 w-60 bg-[#FFF8DE] rounded-xl py-3 font-bold text-lg"
            >
                Continue with Email
            </button>
            <button
                onClick={() => handleNavigation("/home")}
                className="mt-4 w-60 bg-[#FFF8DE] rounded-xl py-3 font-bold text-lg"
            >
                Guest Mode
            </button>
        </div>
    );
}

export default Welcome;