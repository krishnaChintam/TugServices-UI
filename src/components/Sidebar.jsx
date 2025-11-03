import {
  FaUser,
  FaChartBar,
  FaServicestack,
  FaSignOutAlt,
  FaChevronLeft,
  FaUsersCog,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    try {
      if (userData && userData.username) {
        setUsername(userData.username);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  // Menu items
  const menuItems = [
    { icon: <FaChartBar />, text: "Dashboard", path: "/dashboard", id: 1 },
    {
      icon: <FaServicestack />,
      text: "Tug Services",
      path: "/tugservices",
      id: 2,
    },
    { icon: <FaUsersCog />, text: "User", path: "/user-master", id: 3 },
  ];

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
    toggleSidebar();
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div
      className={`
        fixed top-[56px] left-0 h-[calc(100vh-56px)] bg-white border-r
        transition-all duration-300 ease-in-out z-40
        ${sidebarOpen ? "w-56 translate-x-0" : "w-0 -translate-x-full"}
      `}
    >
      {/* Sidebar Header with User Info and Toggle Button */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          !sidebarOpen ? "hidden" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center text-gray-600 mr-2">
            <FaUser size={16} />
          </div>
          <div className={sidebarOpen ? "" : "hidden"}>
            <div className="text-xs text-gray-500">Welcome</div>
            <div className="text-sm font-medium text-gray-900">{username}</div>
          </div>
        </div>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-0 bg-transparent border-none transform transition-all duration-200 group"
          title="Close Menu"
        >
          <div className="flex items-center transform transition-transform duration-200 group-hover:-translate-x-1">
            <FaChevronLeft size={16} />
            <FaChevronLeft
              size={16}
              className="opacity-0 group-hover:opacity-100 -ml-2 transition-opacity duration-200"
            />
          </div>
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-1">
        <ul>
          {menuItems.map((item, index) => {
            // 1. Define the condition for hiding the item
            const shouldHide = item?.id === 3 && userData?.role == "admin";
            // 2. Return null (don't render anything) if the item should be hidden
            if (shouldHide) {
              return null;
            }
            // 3. Otherwise, render the menu item as before
            return (
              <li key={index} className="mb-0.5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item);
                  }}
                  className={`
                  flex items-center px-4 py-2 text-sm rounded-md
                  ${
                    item.active
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }
                  ${!sidebarOpen ? "justify-center" : ""}
                `}
                >
                  <span className="text-base mr-2">{item.icon}</span>
                  <span className={sidebarOpen ? "" : "hidden"}>
                    {item.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Icons */}
      {sidebarOpen && (
      <div
        className={`p-2 fixed bottom-0 left-0 right-0 flex ${
          sidebarOpen ? "justify-between" : "justify-center"
        } border-t`}
      >
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm rounded-md
            text-white-300
            hover:text-white-100 hover:bg-white-900 
            transition-all duration-200"
          title="Logout"
        >
          <span className="text-base">
            <FaSignOutAlt size={16} />
          </span>
          <span className="ml-2">Logout</span>
        </button>
      </div>
)}
    </div>
  );
};

//It is used to validate the props for the Sidebar component and set the default values
Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool, //It is used to check if the sidebar is open or not
  toggleSidebar: PropTypes.func.isRequired, //It is used to toggle the sidebar on mobile devices
};

Sidebar.defaultProps = {
  sidebarOpen: true, //It is used to set the default value of the sidebarOpen prop to true
};

export default Sidebar;
