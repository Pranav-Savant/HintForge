import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { checkAuth } from "../services/api.js";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await checkAuth();
        setIsLoggedIn(res.data.loggedIn);
      } catch {
        setIsLoggedIn(false);
      }
    };

    verify();
  }, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:4000/auth/logout",
      {},
      { withCredentials: true }
    );
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-600">
        HintForge
      </h1>

      <div className="flex items-center space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600 transition">
          Home
        </Link>

        <Link to="/history" className="hover:text-blue-600 transition">
          History
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;