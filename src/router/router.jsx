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
 

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all-policies",
        Component: AllPolicies,
      },
      {
        path: "policies/:id",
        Component: DetailsPolicy,
      },
      {
        path: "get-quote",
        Component: QuotePage,
      },
      {
        path: "policy-apply-from",
        Component: PolicyApplyForm,
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: "addPolicy",
        Component: AddPolicy,
      },
      {
        path: "myApplication",
        Component: MyApplication,
      },
      {
        path: "payment/:id",
        Component: Payment,
      },
    ],
  },
]);
