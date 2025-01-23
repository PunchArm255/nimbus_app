import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFDB4D]">
      <div className="p-8 bg-[#FFF8DE] shadow-md shadow-[#FFF8DE] rounded-3xl max-w-md w-full">
      <img src={Logo} alt="Nimbus Logo" className="w-50 h-50" />
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#FFDB4D] text-white rounded-md hover:bg-[#FFEA96]"
          >
            Sign In
          </button>
        </form>
        <button
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={() => navigate("/home")}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
