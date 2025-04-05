import React, { useState } from "react";
import logo from "./logo.png"
import { FiMenu, FiX } from "react-icons/fi";
const Navbar = () => {

  const [menuOpen,setMenuOpen]= useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent   py-4 px-38 flex items-center  justify-between flex-col sm:flex-row z-50">
      
      <div className="flex items-center min-w-[100px] sm:min-w-[120px]">
        <img
          src= {logo} 
          alt="Logo"
          className="w-[100px] h-auto sm:w-[120px] md:w-[150px] object-contain" // Ensures round logo
        />
      </div>

      <button 
        className="sm:hidden text-white text-3xl focus:outline-none" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Navigation Items */}
      <ul className={`font-bold sm:flex space-x-8 text-lg ${menuOpen ? "flex flex-col justify-center items-center absolute top-39 right-0 left-4 w-full py-5 " : "hidden sm:flex"}`}>
        <li>
          <a
            href="#"
            className="hover:opacity-80 transition duration-300"
            style={{ color: "#FAF7F0" }} // Custom text color
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:opacity-80 transition duration-300"
            style={{ color: "#FAF7F0" }} // Custom text color
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:opacity-80 transition duration-300"
            style={{ color: "#FAF7F0" }} // Custom text color
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:opacity-80 transition duration-300 sm:m-0 mr-8"
            style={{ color: "#FAF7F0" }} // Custom text color
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
