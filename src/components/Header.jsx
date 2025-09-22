import {
    FaBars,
    FaSearch,
    FaBell,
    FaUser,
    FaEllipsisV,
  } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import logo from '../assets/images/logo.png';
  
const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 bg-white shadow-sm border-b">
      {/* Left Side - Menu and Title */}
      <div className="flex items-center space-x-4">
        <FaBars 
          className="text-blue-600 text-lg cursor-pointer" 
          onClick={toggleSidebar}
        />
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>
      </div>
  
      {/* Right Side - Search & Icons */}
      <div className="flex items-center space-x-4">  
        {/* Icons */}
        <FaUser className="text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};
  
export default Header;
  