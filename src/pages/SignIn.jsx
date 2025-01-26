import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import logo from "../assets/logo.svg";
import { useUser } from "../lib/context/user";

function SignIn() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = React.useState(false); // State to handle exit animation

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsExiting(true); // Trigger exit animation
    try {
      await login(email, password);
      setTimeout(() => navigate("/home"), 500); // Wait for animation to complete before navigating
    } catch (err) {
      setError(err.message);
      setIsExiting(false); // Reset exit state if there's an error
    }
  };

  const handleNavigation = (route) => {
    setIsExiting(true); // Trigger exit animation
    setTimeout(() => navigate(route), 500); // Wait for animation to complete before navigating
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-screen bg-[#FAF7EC] flex flex-col justify-center items-center font-['Red_Hat_Display'] text-[#544B3D]"
        >
          <motion.img
            src={logo}
            alt="Nimbus Logo"
            className="w-100 h-19 mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.div
            className="bg-white p-9 rounded-3xl w-80"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {error && <p className="text-red-500 font-semibold text-center mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block font-bold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7EC] font-bold rounded-xl py-2 px-4 outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7EC] font-semibold rounded-xl py-2 px-4 outline-none"
              />
            </div>
            <motion.button
              onClick={handleSignIn}
              className="w-full bg-[#FFDB4D] rounded-xl py-2 font-bold cursor-pointer"
              whileHover={{ scale: 1.05 }} // Hover animation (no color change)
              whileTap={{ scale: 0.95 }} // Click animation
              transition={{ type: "spring", stiffness: 300 }} // Faster hover animation
            >
              Sign In
            </motion.button>
            <p className="text-center mt-4 font-bold">
              Don’t have an account?{' '}
              <motion.span
                onClick={() => handleNavigation("/signup")}
                className="text-[#FFDB4D] font-bold cursor-pointer"
                whileHover={{ scale: 1.05 }} // Hover animation
                whileTap={{ scale: 0.95 }} // Click animation
              >
                Sign Up
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SignIn;