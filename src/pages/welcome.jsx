import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import NimbusLogo from "../assets/nimbus_light.svg";
import { useUser } from "../lib/context/user.jsx";

function Welcome() {
    const navigate = useNavigate();
    const { current, loading } = useUser();
    const [isExiting, setIsExiting] = React.useState(false); // State to handle exit animation

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
                    className="h-screen bg-[#FFDB4D] flex flex-col justify-center items-center font-['Red_Hat_Display'] text-[#544B3D]"
                >
                    <motion.img
                        src={NimbusLogo}
                        alt="Nimbus Logo"
                        className="w-100 h-30"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    />
                    <motion.button
                        onClick={() => handleNavigation("/signin")}
                        className="mt-8 w-60 bg-[#FFF8DE] rounded-xl py-3 font-bold text-lg"
                        whileHover={{ scale: 1.05 }} // Hover animation (no color change)
                        whileTap={{ scale: 0.95 }} // Click animation
                        transition={{ type: "spring", stiffness: 300 }} // Faster hover animation
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Continue with Email
                    </motion.button>
                    <motion.button
                        onClick={() => handleNavigation("/home")}
                        className="mt-4 w-60 bg-[#FFF8DE] rounded-xl py-3 font-bold text-lg"
                        whileHover={{ scale: 1.05 }} // Hover animation (no color change)
                        whileTap={{ scale: 0.95 }} // Click animation
                        transition={{ type: "spring", stiffness: 300, delay: 0.6, duration: 0.5 }} // Faster hover animation
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        Guest Mode
                    </motion.button>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

export default Welcome;