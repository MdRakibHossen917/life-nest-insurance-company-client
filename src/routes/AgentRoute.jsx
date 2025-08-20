import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const AgentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();  

  // Loading spinner
  if (loading || roleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  
  if (!user || role !== "agent") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden" replace />
    );
  }

 
  return children;
};

export default AgentRoute;
