import React, { useContext, useEffect, useState } from 'react';
import ImageSlider from './ImageSlider';
import { motion } from "framer-motion";
import LocationMap from './LocationMap';
import { UserDataContext } from '../Context/UserContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const DetailsWindow = ({ setDetails, details }) => {
    const Images = [details.MainImage, details.SubImage1, details.SubImage2];
    const [Like, setLike] = useState(false)
    const [LikeCount, setLikeCount] = useState(null)
    const {UserData} = useContext(UserDataContext) 

    if(!localStorage.getItem("favitem")){
        localStorage.setItem("favitem", JSON.stringify([]))
    }

    useEffect(() => {
        let favArray = JSON.parse(localStorage.getItem("favitem"))
        let exist = favArray.find((item) => {
            return item.U === UserData.UserID && item.P === details.PropertyID
        })

        if(exist){
            setLike(true)
        }
    }, [UserData.UserID, details.PropertyID])

    async function HandleLike(LC){
        if(Like){
            toast("already Liked")
            return
        }

        setLikeCount(LC + 1)
        try{
            let response = await axios.post("http://localhost:5000/property/add/to/favorites",{
                Uid: UserData.UserID,
                Pid: details.PropertyID
            })
            
            if(response.status === 201) {
                setLike(true)
                let favArray = JSON.parse(localStorage.getItem("favitem")) || []
                let obj = {
                    U: UserData.UserID,
                    P: details.PropertyID
                }
                favArray.push(obj)
                localStorage.setItem("favitem", JSON.stringify(favArray))
                console.log("Liked Done")
            }
        }
        catch(err){
            console.log(err)
        }
        
    }

    return (
        <div className='h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center'>

        <ToastContainer
        position="top-center"         // Position of toast on screen
        autoClose={3000}              // Auto dismiss after 3 seconds
        hideProgressBar={false}       // Show progress bar
        closeOnClick                  // Close toast on click
        pauseOnFocusLoss              // Pause when tab is inactive
        draggable                     // Allow drag to move toast
        pauseOnHover                  // Pause timer when hovered
        theme="light"               // Use colorful theme (based on type)
        />

                          

            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    duration: 0.5,
                }}
                className='w-[90%] md:w-[50%] h-[90%] bg-white shadow-xl rounded-xl overflow-y-scroll overflow-x-hidden relative'
            >

                <div
                    onClick={() => setDetails(null)}
                    className='absolute top-4 right-5 text-2xl font-semibold text-gray-700 hover:text-red-500 transition cursor-pointer z-10'
                >
                    <i className="ri-close-line"></i>
                </div>

                <div className='z-0'>
                    <ImageSlider images={Images} />
                </div>

                <div className='p-4 space-y-3 mt-3'>

                    <div className='flex justify-between items-center border-b pb-2'>
                        <div className='flex items-center gap-3'>
                            <i className="ri-map-pin-5-line text-xl text-blue-600"></i>
                            <h2 className='text-lg font-semibold text-gray-800'>{details.Address}</h2>
                        </div>
                        <p className='text-md font-medium text-gray-600'>{details.City}</p>
                    </div>
                    
                    <div className='flex justify-between items-center border-b pb-2'>
                        <h3 className='text-2xl font-bold text-green-600'>Rs: {details.Amount}</h3>
                        <h4 className='text-gray-700'><b>Post Date:</b> {new Date(details.CreatedAt).toLocaleDateString()}</h4>
                    </div>

                    <div className='border-b text-gray-700 space-y-1 text-md pb-2'>
                        <p><b>Area:</b> {details.Area} Sqft</p>
                        <p><b>Purpose:</b> {details.Purpose}</p>
                        <p><b>Type:</b> {details.Type}</p>
                    </div>

                    <h1 className='font-semibold text-xl'>Contact Info:</h1>
                     <div className='border-b pb-2'>
                        <div className='flex items-center gap-3'>
                            <i className="ri-phone-line text-xl text-blue-600"></i>
                            <h2 className='text-lg font-semibold text-gray-800'>{details.Phone}</h2>
                        </div>
                        <div className='flex items-center gap-3'>
                            <i className="ri-mail-send-line text-xl text-blue-600"></i>
                            <h2 className='text-lg font-semibold text-gray-800'>{details.Email}</h2>
                        </div>

                        <div onClick={() => HandleLike(details.FavoriteCount || 0)} className='cursor-pointer absolute top-[92%] left-[83%] flex gap-1 text-center text-xl'>
                            <i className={Like ? "ri-heart-fill text-red-500 text-2xl" : "ri-heart-line"}></i>
                            <h3>{`Like: ${LikeCount || details.FavoriteCount || 0 }`}</h3>
                        </div>
                    </div>

                    <h1 className='font-semibold text-xl'>Description:</h1>
                    <div className='bg-gray-200 w-full h-28 overflow-y-scroll'>
                        <p className='text-lg p-2'>{details.Description}</p>
                    </div>

                    <div className=''>
                        <h1 className='font-semibold text-2xl mb-3'>Location:</h1>
                        <LocationMap lat={details.Ltd} lng={details.Lng}/>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default DetailsWindow;
