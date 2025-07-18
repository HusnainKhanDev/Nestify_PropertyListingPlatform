import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Cards from '../Components/Cards'
import axios from 'axios'
import { PropertyDataContext } from '../Context/PropertyContext'
import { useContext } from 'react'
import DetailsWindow from '../Components/DetailsWindow'
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from 'react-router-dom'
import FilterData from '../Components/FilterData'

const Home = () => {

  const { PropertyData, fetchPropertyData } = useContext(PropertyDataContext)
  const [Details, setDetails] = useState(null);
  const [FilterOn, setFilterOn] = useState(false)
 
  

  //Fetching Card data from the server
  useEffect(() => {
    fetchPropertyData()
  }, [])


  return (
    <div className='w-full h-full bg-[#dcddd5] bg-opacity-70'>

      <Navbar setFilterOn={setFilterOn}/>

      <div className='p-4'>
        <Cards PropertyData={PropertyData} setDetails={setDetails}/>
      </div>

      
      <div className='z-10 fixed top-7 left-[28%]'>
        <AnimatePresence>
        {Details ? <DetailsWindow setDetails={setDetails} details={Details}/> : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
      {FilterOn && FilterOn === true ?
        (<motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
            className='absolute top-[20%] left-[60%] z-50 w-[35%] transition none ease-in-out duration-200'>
            <FilterData setFilterOn={setFilterOn}
        />
        </motion.div>)
      : null}
      </AnimatePresence>

    </div>
  )
}

export default Home