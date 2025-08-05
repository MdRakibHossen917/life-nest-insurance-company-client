import React from "react";
import authImage from "../assets/Image/AuthPf.jpg";
import { Outlet } from "react-router";
import LifeNestLogo from "../Components/Shared/LifeNestLogo/LifeNestLogo";

const AuthLayout = () => {
  return (
    <div className="m-20 p-12 bg-base-200">
      <div>
        <LifeNestLogo></LifeNestLogo>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
        <div className="flex-1">
          <img src={authImage} className="max-w-sm rounded-lg shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
