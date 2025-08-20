import React from "react";
import UserDashboard from "./UserDashboard";
import AgentDashboard from "./AgentDashboard";
import AdminDashboard from "./AdminDashboard";
import useUserRole from "../../../hooks/useUserRole";
import ForB from "../../ForB/ForB";
 

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <p>Loading...</p>;
  }

  if (role === "user") {
    return <UserDashboard />;
  } else if (role === "agent") {
    return <AgentDashboard />;
  } else if (role === "admin") {
    return <AdminDashboard />;
  } else {
    return <ForB />;
  }
};

export default DashboardHome;
