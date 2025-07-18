import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Signup from "../Components/Signup";
import Login from "../Components/Login";
import 'animate.css';
import Cookies from 'js-cookie';
import axios from "axios";

const Start = () => {
  const LoginPanelRef = useRef(null);
  const SignupPanelRef = useRef(null);
  const [SignupPanel, setSignupPanel] = useState(false);
  const [LoginPanel, setLoginPanel] = useState(false);

  useGSAP(() => {
    if (SignupPanel) {
      gsap.to(SignupPanelRef.current, {
        height: '85%',
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      gsap.to(SignupPanelRef.current, {
        height: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [SignupPanel]);

  useGSAP(() => {
    if (LoginPanel) {
      gsap.to(LoginPanelRef.current, {
        height: '75%',
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      gsap.to(LoginPanelRef.current, {
        height: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [LoginPanel]);





  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800 relative">


    {SignupPanel || LoginPanel ? null : (
      <div className="w-[350px] h-[300px] absolute top-10 block text-center">
        <img src="NestifyBG.png" alt="" />
        <h1 className="text-white -mt-14 text-lg font-medium font-[cursive] animate__animated animate__backInDown animate__delay-1s">
          Your Perfect Space, Your Perfect Place
        </h1>
      </div>
    )}
      

      
      <div className="absolute z-10 bottom-16 bg-gray-400 w-[34%] h-20 rounded-full flex justify-evenly items-center shadow-lg">
          <button className="bg-[#0866c0] text-white py-3 px-12  font-semibold rounded-full text-xl shadow-md hover:bg-black text-centern"
            onClick={() => { setSignupPanel(true); setLoginPanel(false) }}
          >Signup
          </button>

          <button className="bg-[#083787] text-white py-3 px-12 w-[34%] font-semibold rounded-full text-xl shadow-md hover:bg-black  text-center"
            onClick={() => { setLoginPanel(true); setSignupPanel(false) }}
          >Login
          </button>
      </div>

      <div ref={SignupPanelRef} className="absolute w-[28%] h-0 rounded-lg shadow-lg overflow-hidden">
        {/* Jahan pr bhi nahi chup raha ho overflow hidden daldo gayab ho jaye ga  */}
        <Signup />
      </div>

      <div ref={LoginPanelRef} className="absolute w-[28%] h-0 rounded-lg shadow-lg overflow-hidden">
        <Login />
      </div>

    </div>
  );
};

export default Start;
