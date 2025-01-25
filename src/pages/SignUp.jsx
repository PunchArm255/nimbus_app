import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useUser } from "../lib/context/user";

function SignUp() {
  const navigate = useNavigate();
  const { register } = useUser();
  const [name, setName] = useState(""); // Only name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, name); // Pass only name
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-[#FAF7EC] flex flex-col justify-center items-center font-['Red_Hat_Display'] text-[#544B3D]">
      <img src={logo} alt="Nimbus Logo" className="w-100 h-19 mb-8" />
      <div className="bg-white p-9 rounded-3xl w-80">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block font-bold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          className="w-full bg-[#FFDB4D] font-bold rounded-xl py-2"
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