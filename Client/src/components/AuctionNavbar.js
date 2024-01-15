import React from "react";
import { NavLink } from "react-router-dom";
import Logout from "../Logout";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";

const AuctionNavbar = () => {
  const { user } = useSelector((state) => state.users);

  return (
    <>
      <nav
        id="nav"
        className="fixed inset-x-0 top-0 flex flex-col md:flex-row justify-between z-10 text-white bg-transparent"
      >
        <div className="p-4 flex flex-col md:flex-row items-center">
          <div className="font-bold tracking-widest text-xl mb-4 md:mb-0">
            <NavLink
              to="/"
              className="transition duration-500 hover:text-purple-500"
            >
              P2P Optimal Energy Trading
            </NavLink>
          </div>

          <div className="bg-black-200 absolute bg-white text-black top-[60px] px-10 py-1  ml-4 text-xl md:ml-0 font-semibold rounded-xl ">
            <div className="flex gap-2 justify-center items-center ">
            <UserOutlined />
            {user}
            </div>
           
            
          </div>

        </div>

        {/* Nav Items Working on Tablet & Bigger Screen */}
        <div className="p-4 hidden md:flex flex-row justify-between font-bold items-center">
          <NavLink
            id="hide-after-click"
            to="/market"
            className="mx-4 text-lg hover:text-purple-500 border-b-2 border-transparent hover:border-b-2 hover:border-purple-300 transition duration-500"
          >
            Market Place
          </NavLink>
          <NavLink
            id="hide-after-click"
            to="/auction"
            className="mx-4 text-lg hover:text-purple-500 border-b-2 border-transparent hover:border-b-2 hover:border-purple-300 transition duration-500"
          >
            Auction
          </NavLink>
          <NavLink
            id="hide-after-click"
            to="/updatPro"
            className="mx-4 text-lg hover:text-purple-500 border-b-2 border-transparent hover:border-b-2 hover:border-purple-300 transition duration-500"
          >
             Profile
          </NavLink>

          <Logout />
        </div>
      </nav>
    </>
  );
};

export default AuctionNavbar;
