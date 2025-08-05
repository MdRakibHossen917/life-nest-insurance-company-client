import React from "react";
import { Outlet, NavLink } from "react-router";

const DashboardLayout = () => {
  const navItemClass = ({ isActive }) =>
    isActive ? "font-bold text-blue-600" : "text-gray-700";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <NavLink to="addPolicy" className={navItemClass}>
            Add Policy
          </NavLink>
          <NavLink to="addBlogs" className={navItemClass}>
            Add Blogs
          </NavLink>
          <NavLink to="profile" className={navItemClass}>
            Profile
          </NavLink>
          <NavLink to="/" className={navItemClass}>
            Back To Home
          </NavLink>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 bg-white">
        {/* Render nested routes here */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
