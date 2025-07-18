import React, { useContext, useState } from 'react';
import { PropertyDataContext } from '../Context/PropertyContext';
import axios from 'axios';

const FilterData = ({setFilterOn}) => {

    const [Amount, setAmount] = useState(50000)
    const [Purpose, setPurpose] = useState('')
    const [Area, setArea] = useState('')
    const [City, setCity] = useState('')
    const [Type, setType] = useState('')
    const [Msg, setMsg] = useState('')

    const {setPropertyData, fetchPropertyData } = useContext(PropertyDataContext)

    async function handleFilter(){
        try{
            let response = await axios.get('http://localhost:5000/property/get/filter/items',{
                params: {
                    Amount,
                    Purpose,
                    Area,
                    City,
                    Type
                }
            })

            if(response.status === 200){
                setPropertyData(response.data.result.recordset)
            }  

        }
        catch(err){
            setMsg(err.response.data.msg)
            console.log("Error In Filter", err)
        }
    }

    function handleClear(){
        fetchPropertyData()
    }

    if(Msg){
        setTimeout(() => {
            setMsg('')
        }, 2000)
    }
    
    return (
        <div className='h-auto w-full text-white bg-gradient-to-r from-purple-800 to-violet-400 shadow-xl rounded-xl p-6'>
            
            <div
                onClick={() => setFilterOn(false)}
                className='absolute top-1 right-5 text-2xl font-semibold text-white hover:text-red-500 cursor-pointer'
            >
                <i className="ri-close-line"></i>
            </div>

            <div className='flex flex-col gap-5 mt-4'>

                <input type="text"
                    onChange={(e) => { setCity(e.target.value) }}
                    placeholder='City (e.g: Karachi)'
                    className='placeholder:text-white bg-transparent border-2 border-white rounded-lg h-10 p-3 focus:outline-none focus:bg-[#2c2b2b48]'
                />
                <input type="text"
                    onChange={(e) => { setArea(e.target.value) }}
                    placeholder='Area (e.g: 600 Sqft)'
                    className='placeholder:text-white bg-transparent border-2 border-white rounded-lg h-10 p-3 focus:outline-none focus:bg-[#2c2b2b48]'
                />

                <input type="text"
                    onChange={(e) => { setType(e.target.value) }}
                    placeholder='Type (e.g: Flat / House / Shop)'
                    className='placeholder:text-white bg-transparent border-2 border-white rounded-lg h-10 p-3 focus:outline-none focus:bg-[#2c2b2b48]'
                />

                <input type="text"
                    onChange={(e) => { setPurpose(e.target.value) }}
                    placeholder='Purpose (e.g: Rent / Sale)'
                    className='placeholder:text-white bg-transparent border-2 border-white rounded-lg h-10 p-3 focus:outline-none focus:bg-[#2c2b2b48]'
                />

                <div>
                    <label className='text-white font-medium  mb-1'>Amount Range Rs: </label>
                    <input 
                        className='bg-transparent rounded-lg py-1 text-center focus:outline-none focus:font-semibold hover:bg-[#8789f5d5] w-20'
                        type="text" value={Amount} onChange={(e) => { setAmount(e.target.value) }}/>
                    <input
                        onChange={(e) => { setAmount(e.target.value) }}
                        type="range"
                        min="1"
                        max="1000000"
                        className='w-full to-blue-100 cursor-pointer mt-2'
                    />
                </div>
                <div className='flex justify-around'>
                    <button
                        onClick={handleFilter}
                        className=' transition-transform duration-200 hover:scale-110 hover:bg-green-500 w-32 h-10 rounded-3xl  border-2 border-white font-semibold'>Save</button>
                    <button
                        onClick={handleClear}
                        className=' transition-transform duration-200 hover:scale-110 hover:bg-red-500 w-32 h-10 rounded-3xl  border-2 border-white font-semibold'>Clear</button>
                </div>
                {Msg && Msg != '' ? (<p className='border-2 p-2 border-orange-600'>{Msg}</p>): null}
            </div>
        </div>
    )
}

export default FilterData;
