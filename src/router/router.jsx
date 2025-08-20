import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import DashboardLayout from "../layouts/DashboardLayout";
import AddPolicy from "../Pages/Dashboard/AddPolicy/AddPolicy";
import AllPolicies from "../Pages/AllPolicies/AllPolicies";
import DetailsPolicy from "../Pages/AllPolicies/DetailsPolicy";
import QuotePage from "../Pages/AllPolicies/QuotePage";
import PolicyApplyForm from "../Components/Form/PolicyApplyForm";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import MyApplication from "../Pages/Dashboard/MyApplication/MyApplication";
import Payment from "../Pages/Dashboard/Payment/Payment";
import ManageBlogs from "../Pages/Dashboard/ManageBlogs/ManageBlogs";
import AddBlogs from "../Pages/Dashboard/AddBlogs/AddBlogs";
import Blogs from "../Pages/Blogs/Blogs";
import RequestAgent from "../Pages/RequestAgent/RequestAgent";
import Profile from "../Pages/Dashboard/Profile/Profile";
import ManageAgent from "../Pages/Dashboard/ManageAgent/ManageAgent";
import ManageApplications from "../Pages/Dashboard/ManageApplications/ManageApplications";
import ManageTransactions from "../Pages/Dashboard/ManageTransactions/ManageTransactions";
import AdminTransactions from "../Pages/Dashboard/AdminTransactions/AdminTransactions";
import ManagePolicy from "../Pages/Dashboard/ManagePolicy/ManagePolicy";
import BlogDetails from "../Pages/Blogs/BlogDetails";
import AssignedCustomers from "../Pages/Dashboard/AssignedCustomers/AssignedCustomers";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import AdminRoute from "../routes/AdminRoute";
import AgentRoute from "../routes/AgentRoute";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-policies", element: <AllPolicies /> },
      { path: "policies/:id", element: <DetailsPolicy /> },
      { path: "get-quote", element: <QuotePage /> },
      { path: "policy-apply-from", element: <PolicyApplyForm /> },
      { path: "blogs", element: <Blogs /> },
      { path: "/blogs/:id", element: <BlogDetails /> },
      { path: "requestAgent", element: <RequestAgent /> },
    ],
  },

  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, Component: DashboardHome },

      // 🔒 Admin only
      {
        path: "addPolicy",
        element: (
          <AdminRoute>
            <AddPolicy />
          </AdminRoute>
        ),
      },
      {
        path: "manageAgent",
        element: (
          <AdminRoute>
            <ManageAgent />
          </AdminRoute>
        ),
      },
      {
        path: "manageApplications",
        element: (
          <AdminRoute>
            <ManageApplications />
          </AdminRoute>
        ),
      },
      {
        path: "adminTransactions",
        element: (
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },

      // 🔒 Agent only
      {
        path: "manageBlogs",
        element: (
          <AgentRoute>
            <ManageBlogs />
          </AgentRoute>
        ),
      },
      {
        path: "assignedCustomers",
        element: (
          <AgentRoute>
            <AssignedCustomers />
          </AgentRoute>
        ),
      },

      // ✅ Common
      { path: "myApplication", element: <MyApplication /> },
      { path: "payment/:id", element: <Payment /> },
      { path: "profile", element: <Profile /> },
    ],
  },

  // fallback for not found
  {
    path: "*",
    element: <h2 className="text-center text-red-500 mt-10">404 Not Found</h2>,
  },
]);
