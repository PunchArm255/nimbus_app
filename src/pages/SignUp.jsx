import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    document.body.style.transition = "background-color 0.5s ease";
    document.body.style.backgroundColor = "#FAF7EC";
    setTimeout(() => navigate("/home"), 500);
  };

  return (
    <div className="h-screen bg-[#FAF7EC] flex flex-col justify-center items-center font-['Red_Hat_Display'] text-[#544B3D]">
      <img src={logo} alt="Nimbus Logo" className="w-100 h-19 mb-8" />
      <div className="bg-white p-9 rounded-3xl w-80">
        <div className="mb-4">
          <label className="block font-bold mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#FAF7EC] font-semibold rounded-xl py-2 px-4 outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#FAF7EC] font-semibold rounded-xl py-2 px-4 outline-none"
          />
        </div>
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
          onClick={handleSignUp}
          className="w-full bg-[#FFDB4D] font-bold rounded-xl py-2 font-bold"
        >
          Sign Up
        </button>
        <p className="text-center font-bold mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate("/signin")}
            className="text-[#FFDB4D] font-bold cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
