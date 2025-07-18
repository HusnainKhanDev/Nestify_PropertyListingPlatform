import React, { useEffect } from 'react'
import { createContext } from 'react'
import { useState } from 'react'
import axios from 'axios'

export const PropertyDataContext = createContext()

const PropertyContext = ({children}) => {

    const [PropertyData, setPropertyData] = useState([])

    async function fetchPropertyData() {
      try {
        const response = await axios.get('http://localhost:5000/property/fetch/all')
        setPropertyData(response.data.AllProperties.recordset)
      }
      catch (error) {
        console.error('Error fetching property data:', error);
      }
    }



  return (
    <PropertyDataContext.Provider value={{ PropertyData, setPropertyData, fetchPropertyData }}>
        {children}
    </PropertyDataContext.Provider>
    
  )
}

export default PropertyContext