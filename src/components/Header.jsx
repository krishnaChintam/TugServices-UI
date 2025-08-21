import {
    FaBars,
    FaSearch,
    FaBell,
    FaUser,
    FaEllipsisV,
  } from 'react-icons/fa';
import PropTypes from 'prop-types';
import logo from '../assets/images/logo.png';
  
const Header = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 bg-white shadow-sm border-b">
      {/* Left Side - Menu and Title */}
      <div className="flex items-center space-x-4">
        <FaBars 
          className="text-blue-600 text-lg cursor-pointer" 
          onClick={toggleSidebar}
        />
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>
      </div>
  
      {/* Right Side - Search & Icons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2 w-64">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none text-sm flex-1 placeholder-gray-500"
          />
          <FaSearch className="ml-2 text-gray-500" />
        </div>
  
        {/* Icons */}
        <FaBell className="text-gray-700 cursor-pointer" />
        <FaUser className="text-gray-700 cursor-pointer" />
        <FaEllipsisV className="text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};
  
export default Header;
  