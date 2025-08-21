import {
  FaUser,
  FaChartBar,
  FaVideo,
  FaFileInvoiceDollar,
  FaServicestack,
  FaShieldAlt,
  FaCog,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronLeft,
  FaList
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '@/api/authService';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('User');

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && userData.username) {
        setUsername(userData.username);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }, []);

  // Menu items
  const menuItems = [
    { icon: <FaChartBar />, text: 'Dashboard', active: true, path: '/dashboard' },
    { icon: <FaServicestack />, text: 'Tug Services', path: '/tugservices' },
  ];

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path);
      // Close sidebar on mobile after navigation
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    // Call the logout method from authService
    authService.logout();
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div
      className={`
        fixed top-[56px] left-0 h-[calc(100vh-56px)] bg-white border-r shadow-md
        transition-all duration-300 ease-in-out z-40
        ${sidebarOpen 
          ? "w-64 translate-x-0" 
          : "w-0 -translate-x-full"}
      `}
    >
      {/* User Profile */}
      <div className={`px-4 py-4 border-b flex items-center ${!sidebarOpen ? "justify-center hidden" : ""}`}>
        <div className={sidebarOpen 
            ? "w-10 h-10 bg-blue-100 items-center rounded-full flex justify-center text-blue-800 mr-3" 
            : "text-blue-800 hidden"}
        >
          <FaUser />
        </div>
        <div className={sidebarOpen ? "" : "hidden"}>
          <div className="text-sm text-gray-500">Welcome</div>
          <div className="font-semibold text-gray-900">{username}</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(item.path);
                }}
                className={`
                  flex items-center px-4 py-3 text-sm 
                  ${item.active
                      ? "text-indigo-600 bg-indigo-100 border-l-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                  ${!sidebarOpen && "justify-center"}
                `}
              >
                <span className={`text-lg ${!sidebarOpen ? "mx-auto" : "mr-3"}`}>
                  {item.icon}
                </span>
                <span className={sidebarOpen ? "" : "hidden"}>{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Icons */}
      <div className={`p-4 fixed bottom-0 left-0 right-0 flex ${sidebarOpen ? "justify-between" : "justify-center"}`}>
        <button className={`text-gray-600 hover:text-blue-600 ${sidebarOpen ? "" : "hidden"}`}>
          <FaCog />
        </button>
        <button className={`text-gray-600 hover:text-blue-600 ${sidebarOpen ? "" : "hidden"}`}>
          <FaEnvelope />
        </button>
        <button 
          onClick={handleLogout}
          className={`text-gray-600 hover:text-blue-600 ${sidebarOpen ? "" : "hidden"}`}
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Toggle Button - Visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 text-gray-600 hover:text-blue-600 focus:outline-none"
        >
          <FaChevronLeft />
        </button>
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
  sidebarOpen: true //It is used to set the default value of the sidebarOpen prop to true
};

export default Sidebar;
