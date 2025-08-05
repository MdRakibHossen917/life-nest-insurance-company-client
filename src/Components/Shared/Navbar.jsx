import React from "react";
import { Link, NavLink, useNavigate } from "react-router";  
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/Image/logo.png"; 

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log("Successfully logged out");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const navItems = (
    <>
      <li>
        <NavLink to="/" className={"text-black font-bold"}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-policies" className={"text-black font-bold"}>
          All Policies
        </NavLink>
      </li>
      <li>
        <NavLink to="/articles" className={"text-black font-bold"}>
          Articles
        </NavLink>
      </li>
      <li>
        <NavLink to="/beAgent" className={"text-black font-bold"}>
          Request_Agent
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" className={"text-black font-bold"}>
          Dashboard
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-[#78B9B5] shadow-sm px-4">
      {/* 🔵 Left: Logo and Brand Name */}
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="LifeNest Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-xl font-bold text-white">LifeNest</span>
        </Link>

        {/* 🔻 Dropdown menu (mobile) */}
        <div className="dropdown lg:hidden ml-2">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
      </div>

      {/* 🔷 Center: Nav items (for large screens) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      {/* 🔶 Right: Auth button */}
      <div className="navbar-end">
        <p>{user?.email || "Not email" }</p>
        {user ? (
       
          <button
            onClick={handleLogOut}
            className="btn btn-outline btn-accent text-black font-bold"
          >
            Log Out
          </button>
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
