import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    document.body.style.transition = "background-color 0.5s ease";
    document.body.style.backgroundColor = "#FAF7EC";
    setTimeout(() => navigate("/home"), 500);
  };

  return (
    <div className="h-screen bg-[#FAF7EC] flex flex-col justify-center items-center font-['Red_Hat_Display'] text-[#544B3D]">
      <img src={logo} alt="Nimbus Logo" className="w-100 h-19 mb-8" />
      <div className="bg-white p-9 rounded-3xl w-80">
        <div className="mb-4">
          <label className="block font-bold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FAF7EC] font-semibold rounded-xl py-2 px-4 outline-none"
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
        <button
          onClick={handleSignIn}
          className="w-full bg-[#FFDB4D] rounded-xl py-2 font-bold"
        >
          Sign In
        </button>
        <p className="text-center mt-4 font-bold">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#FFDB4D] font-bold cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;