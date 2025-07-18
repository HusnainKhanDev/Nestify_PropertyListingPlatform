import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import {PropertyDataContext} from '../Context/PropertyContext';
import Cookies from 'js-cookie';
import axios from 'axios';

const Navbar = ({ setFilterOn }) => {
  const { UserData } = useContext(UserDataContext);
  const { fetchPropertyData, setPropertyData } = useContext(PropertyDataContext);
  const navigate = useNavigate();
  const [Ltd, setLdt] = useState("")
  const [Lng, setLng] = useState("")

  function handleLogout() {
    Cookies.remove('token');
    Cookies.remove('token', { path: '/', domain: 'http://localhost:5173' });
    localStorage.setItem('User', "");
    localStorage.setItem('favitem', "");
    navigate('/');
  }



 async function HandleNearBy() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const Ltd = position.coords.latitude;
        const Lng = position.coords.longitude;

        console.log("Latitude:", Ltd);
        console.log("Longitude:", Lng);

        try {
          const response = await axios.get('http://localhost:5000/property/nearby-properties', {
            params: {
              ltd: Ltd,
              lng: Lng
            }
          });

          if (response.status === 200) {
            console.log(response.data.Nearby.recordset);
            setPropertyData(response.data.Nearby.recordset);
          }
        } catch (err) {
          console.log("Error From Near By", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}



  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-3">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-lg">
              <img src='/Nestify2.png'></img>
            </div>
            <span className="text-xl font-bold text-white">Nestify</span>
          </div>

          {/* User Greeting */}
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-700 bg-opacity-50">
            <i className="ri-user-3-fill text-blue-400"></i>
            <span className="text-sm font-medium">
              Hi, <span className="text-blue-300">{UserData?.Name}</span>
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-6 py-3 bg-gray-900 bg-opacity-80 border-t border-gray-700">
          <Link 
            onClick={() => fetchPropertyData()}
            to="/home" 
            className="flex flex-col items-center px-3 py-2 text-gray-300 hover:text-white transition-colors group"
          >
            <i className="ri-home-2-line text-xl group-hover:text-blue-400 "></i>
            <span className="text-md">Home</span>
          </Link>
          
          <Link 
            to="/Post/Property" 
            className="flex flex-col items-center px-3 py-2 text-gray-300 hover:text-white transition-colors group"
          >
            <i className="ri-add-circle-line text-xl group-hover:text-green-400"></i>
            <span className="text-md">Post</span>
          </Link>
          
          <Link 
            to="/Property/Listing" 
            className="flex flex-col items-center px-3 py-2 text-gray-300 hover:text-white transition-colors group"
          >
            <i className="ri-list-check-2 text-xl group-hover:text-yellow-400"></i>
            <span className="text-md">Listings</span>
          </Link>

          <Link 
            to="/favorites/Property" 
            className="flex flex-col items-center px-3 py-2 text-gray-300 hover:text-white transition-colors group"
          >
            <i className="ri-heart-2-line text-xl group-hover:text-red-400"></i>
            <span className="text-md">Favorites</span>
          </Link>
          
          <button 
            onClick={() => setFilterOn(true)}
            className="flex flex-col items-center px-3 py-2 text-gray-300 hover:text-white transition-colors group"
          >
            <i className="ri-filter-2-line text-xl group-hover:text-purple-400 "></i>
            <span className="text-md">Filter</span>
          </button>

          <div 
            onClick={HandleNearBy}
            className="flex flex-col items-center px-3 py-2 text-gray-300 hover:text-white transition-colors group"
          >
            <i className="ri-map-pin-user-line text-xl group-hover:text-red-400"></i>
            <span className="text-md">Near By</span>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;