import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import DashboardLayout from "../layouts/DashboardLayout";
import AddPolicy from "../Pages/Dashboard/AddPolicy/AddPolicy";
import AllPolicies from "../Pages/AllPolicies/AllPolicies";
import DetailsPolicy from "../Pages/AllPolicies/DetailsPolicy";
import QuotePage from "../Pages/AllPolicies/QuotePage";

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
    ],
  },
]);
