import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import NimbusLogo from "../assets/nimbus_light.svg";
import { useUser } from "../lib/context/user.jsx";
import { useTheme } from "../lib/context/theme"; // Add this import

function Welcome() {
    const navigate = useNavigate();
    const { current, loading } = useUser();
    const [isExiting, setIsExiting] = React.useState(false); // State to handle exit animation
    const { isDarkMode } = useTheme(); // Add this hook

    useEffect(() => {
        if (!loading && current) {
            navigate("/home"); // Redirect to home if user is logged in
        }
    }, [current, loading, navigate]);

    const handleNavigation = (route) => {
        setIsExiting(true); // Trigger exit animation
        setTimeout(() => navigate(route), 500); // Wait for animation to complete before navigating
    };

    if (loading || current) {
        return null; // Show nothing while loading or if user is logged in
    }

    return (
        <AnimatePresence>
            {!isExiting ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, backgroundColor: "#FAF7EC" }}
                    transition={{ duration: 0.5 }}
                    className={`h-screen ${isDarkMode
                        ? "bg-[#1A1A1A] text-[#F4E5AF]"
                        : "bg-[#FFDB4D] text-[#544B3D]"
                        } flex flex-col justify-center items-center font-['Red_Hat_Display']`}
                >
                    <motion.img
                        src={NimbusLogo}
                        alt="Nimbus Logo"
                        className="w-80 h-30"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    />
                    <motion.button
                        onClick={() => handleNavigation("/signin")}
                        className="mt-2 w-50 bg-[#FFF8DE] text-[#544B3D] rounded-xl cursor-pointer py-3 font-bold text-sm"
                        whileHover={{ scale: 1.05 }} // Hover animation (no color change)
                        whileTap={{ scale: 0.95 }} // Click animation
                        transition={{ type: "tween", stiffness: 300, delay: 0.2, duration: 0.5 }} // Faster hover animation
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        Continue with Email
                    </motion.button>
                    <motion.button
                        onClick={() => handleNavigation("/home")}
                        className="mt-4 w-50 bg-[#FFF8DE] text-[#544B3D] rounded-xl cursor-pointer py-3 font-bold text-sm"
                        whileHover={{ scale: 1.05 }} // Hover animation (no color change)
                        whileTap={{ scale: 0.95 }} // Click animation
                        transition={{ type: "tween", stiffness: 300, delay: 0.2, duration: 0.5 }} // Faster hover animation
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        Debug Mode
                    </motion.button>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

export default Welcome;