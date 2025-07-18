import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../Context/UserContext'
import { PropertyDataContext } from '../Context/PropertyContext'
import axios from 'axios'
import { AnimatePresence } from 'framer-motion'
import DetailsWindow from '../Components/DetailsWindow'
import Navbar from '../Components/Navbar'

const Favorites = () => {

    const { UserData } = useContext(UserDataContext)
    const { PropertyData, fetchPropertyData } = useContext(PropertyDataContext)

    const [favorites, setfavorites] = useState()
    const [Data, setData] = useState(null)
    const [Show, setShow] = useState(null)

    // console.log("favorites", favorites)
    // console.log("PropertyData", PropertyData)

    useEffect(() => {
        async function getfav() {
            try {
                let result = await axios.get("http://localhost:5000/property/get/favProperties/byUser-ID", {
                    params: {
                        userid: UserData.UserID
                    }
                })

                if (result.status === 200) {
                    setfavorites(result.data.favorites.recordset)
                }
            }
            catch (err) {
                console.log(err, "Something wrong in getting fav")
            }
        }

        getfav()

    }, [])

    useEffect(() => {
        fetchPropertyData()
        if (!favorites || favorites.length === 0 || !PropertyData || PropertyData.length === 0) {
            console.log("Waiting for data")
            return;
        }
        //filter loop over the propertyData and some checks if they match if matched it return true and filter keept that property taking only properties from context which mached by favorites come from database
        const matched = PropertyData.filter(prop => favorites.some(fav => fav.Property_ID === prop.PropertyID));
        setData(matched)
        console.log("matched", matched)
    }, [favorites])


    async function handleDelete(PID) {
        console.log(UserData.UserID, PID)
        try{
            let response = await axios.delete("http://localhost:5000/property/delete/fav-Property",{
                params: {
                    Uid: UserData.UserID,
                    Pid: PID
                }
            })
            
            if(response.status === 200) {
                let favArray = JSON.parse(localStorage.getItem("favitem")) || []
                let NewfavArray = favArray.filter((e) => e.U !== UserData.UserID && e.P !== PID)
                localStorage.setItem("favitem", JSON.stringify(NewfavArray))
                //his is a special syntax used when we want to update state based on the previous value of that state.
                setData(prev => prev.filter(item => item.PropertyID !== PID));
                console.log("DisLiked Done")
            }
        }
        catch(err){
            console.log(err)
        }
    }


    return (
        <div>
            <Navbar/>

            <div className='z-10 fixed top-7 left-[28%]'>
                <AnimatePresence>
                    {Show ? <DetailsWindow setDetails={setShow} details={Show} /> : null}
                </AnimatePresence>
            </div>

            <h2 className="text-3xl p-4 font-semibold mb-1 font-[delius]">Your Favorite Properties</h2>
            <div className="p-4">
            <table className="w-full text-left border border-gray-300 shadow-sm rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3">Address</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Remove</th>
                        <th className="p-3">Show</th>
                    </tr>
                </thead>

                <tbody>
                    {Data && Data.length > 0 ? (
                        Data.map((property, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="p-3">{property.Address}</td>
                                <td className="p-3">{property.Purpose}</td>
                                <td className="p-3">Rs. {property.Amount}</td>
                                <td className="p-3">{property.City}</td>
                                <td className="p-3">
                                    <button 
                                    onClick={() => handleDelete(property.PropertyID)}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                                        <i className="ri-dislike-line text-xl"></i>
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setShow(property)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        Show
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-4 text-center text-gray-500">No favorites found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>

    )
}

export default Favorites