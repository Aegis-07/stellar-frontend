"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Example auth context
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPen, faLock, faWallet } from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const { user, token, currentRole } = useAuth(); // Example auth context
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [, setError] = useState("");

  const GET_USER_API = process.env.NEXT_PUBLIC_API_URL + "/api/auth/me";
  const UPDATE_USER_API = process.env.NEXT_PUBLIC_API_URL + "/api/auth/update"

  const fetchUser = async () => {
    if (!user || !token) return;

    setLoading(true); // ✅ Ensure loading starts when fetching

    try {
      const res = await fetch(GET_USER_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("❌ Invalid Token");
        throw new Error("Invalid Token.");
      }

      const userInfo = await res.json();
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setWalletAddress(userInfo.walletAddress || "");
    } catch (err) {
      console.error("❌ Error getting user info:", err);
      setError("Failed to fetch user info.");
    } finally {
      setLoading(false); // ✅ Ensure loading stops only after fetch is completed
    }
  };

  const updateUser = async () => {
    if (!user || !token) return;

    setLoading(true);

    try {
      const res = await fetch(UPDATE_USER_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          walletAddress
        })
      })
      if (!res.ok) throw new Error("Failed to update profile.");

      setEditing(false)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    if (!user || !token) return;

    setLoading(true);

    try {
      const res = await fetch(UPDATE_USER_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password
        })
      })
      if (!res.ok) throw new Error("Faild to update profile");

      setEditing(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [user, token])

  // Handle profile update
  const handleUpdateProfile = async () => {
    await updateUser()
    alert("Profile updated successfuly")
  };

  const handleChangePassword = async () => {
    if (!password) {
      return alert("Please enter a new password.");
    } else {
      await updatePassword()
      setPassword("");
      alert("Password updated successfuly")
    }
  };

  return loading ? (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <p className="text-lg">Loading...</p>
    </div>
  ) : (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white relative">

      {/* blur background start */}
      <div className="absolute inset-0 bg-[url('/dashboard.png')] bg-cover bg-center blur-xl"></div>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-xl"></div>
      {/* blur background end */}

      <div className="max-w-3xl w-full mx-auto p-6 bg-gray-800 shadow-lg rounded-lg my-10 z-10">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 border-b border-gray-700 pb-4">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-4xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{name || "John Doe"}</h1>
            <p className="text-gray-400">{currentRole || "Developer"}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-md">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
            <input
              type="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-transparent px-3 py-2 cursor-not-allowed focus:outline-none }`}
            />
          </div>

          <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-md">
            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
            <input
              type="text"
              value={name}
              disabled={!editing}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-transparent px-3 py-2 focus:outline-none ${editing ? "border border-blue-400" : "cursor-not-allowed"}`}
            />
          </div>

          <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-md">
            <FontAwesomeIcon icon={faWallet} className="text-gray-400" />
            <input
              type="text"
              value={walletAddress}
              disabled={!editing}
              onChange={(e) => setWalletAddress(e.target.value)}
              className={`w-full bg-transparent px-3 py-2 focus:outline-none ${editing ? "border border-blue-400" : "cursor-not-allowed"}`}
            />
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => (editing ? handleUpdateProfile() : setEditing(true))}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faPen} />
            <span>{editing ? "Save Changes" : "Edit Profile"}</span>
          </button>

          {/* Change Password */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-md mt-2">
              <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              <input
                type="password"
                value={password}
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-2 focus:outline-none border border-gray-600"
              />
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters.</p>
            )}
            <button
              onClick={handleChangePassword}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md mt-2"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProfilePage;
