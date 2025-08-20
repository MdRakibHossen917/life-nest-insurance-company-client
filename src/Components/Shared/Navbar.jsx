import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/Image/logo.png";
import defaultAvatar from "../../assets/Image/default.jpg";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => navigate("/login"))
      .catch((err) => console.error("Logout error:", err));
  };

  const navItems = (
    <>
      <li>
        <NavLink to="/" className="text-black font-bold">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-policies" className="text-black font-bold">
          All Policies
        </NavLink>
      </li>
      <li>
        <NavLink to="/blogs" className="text-black font-bold">
          Blogs
        </NavLink>
      </li>
      <li>
        <NavLink to="/requestAgent" className="text-black font-bold">
          Request Agent
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className="text-black font-bold">
          About
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className="text-black font-bold">
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-[#78B9B5] shadow-sm px-4">
      {/* Logo */}
      <div className="navbar-start flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="LifeNest Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-xl font-bold text-white">LifeNest</span>
        </Link>
      </div>

      {/* Center nav (desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      {/* Auth + Avatar */}
      <div className="navbar-end flex items-center gap-3">
        {user ? (
          <>
            <img
              src={user.photoURL || defaultAvatar}
              alt={user.displayName || "User Avatar"}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="text-white font-medium">{user.email}</span>
            <button
              onClick={handleLogOut}
              className="btn btn-outline btn-accent text-black font-bold"
            >
              Log Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-outline btn-accent font-bold text-black"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
