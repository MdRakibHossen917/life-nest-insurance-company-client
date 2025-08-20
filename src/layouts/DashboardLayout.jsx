import React from "react";
import { Outlet, NavLink } from "react-router";
import useUserRole from "../hooks/useUserRole";
import logo from "../assets/Image/logo.png";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  console.log("User role:", role);

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  const navItemClass = ({ isActive }) =>
    isActive
      ? "font-semibold text-blue-600 border-l-4 border-blue-600 pl-2"
      : "text-gray-700 hover:text-blue-500 transition";

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-100 p-6 shadow-md flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 object-contain bg-white p-2 rounded"
          />
          <h2 className="text-xl font-bold">LifeNest</h2>
        </div>

        <nav className="flex flex-col space-y-4">
          {/* Admin Routes */}
          {role?.toLowerCase() === "admin" && (
            <>
              <NavLink to="addPolicy" className={navItemClass}>
                Add Policy
              </NavLink>
              <NavLink to="manageAgent" className={navItemClass}>
                Manage Agent
              </NavLink>
              <NavLink to="manageApplications" className={navItemClass}>
                Manage Applications
              </NavLink>
              <NavLink to="adminTransactions" className={navItemClass}>
                All Transactions
              </NavLink>
              <NavLink to="makeAdmin" className={navItemClass}>
                Make Admin
              </NavLink>
            </>
          )}

          {/* Agent Routes */}
          {role?.toLowerCase() === "agent" && (
            <>
              <NavLink to="manageBlogs" className={navItemClass}>
                Manage Blogs
              </NavLink>
              <NavLink to="assignedCustomers" className={navItemClass}>
                Assigned Customers
              </NavLink>
              <NavLink to="agentPolicyClearance" className={navItemClass}>
                Agent Policy Clearance
              </NavLink>
            </>
          )}

          {/* Common Routes */}
          <NavLink to="myApplication" className={navItemClass}>
            My Policies
          </NavLink>
          <NavLink to="profile" className={navItemClass}>
            Profile
          </NavLink>
          <NavLink to="/dashboard" className={navItemClass}>
            My Dashboard
          </NavLink>
          <NavLink to="/" className={navItemClass}>
            Back To Home
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
