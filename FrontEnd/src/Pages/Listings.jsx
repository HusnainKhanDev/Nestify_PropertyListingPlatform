import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import { UserDataContext } from '../Context/UserContext';
import {PropertyDataContext} from '../Context/PropertyContext'
import { useContext } from 'react';
import Navbar from '../Components/Navbar';
import { div } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';
import Analytics from '../Components/Analytics';

const Listings = () => {


  const [listings, setListings] = useState([])
  const { UserData } = useContext(UserDataContext);
  const {PropertyData, setPropertyData} = useContext(PropertyDataContext)
  const userId = UserData ? UserData.UserID : null;
  const navigate = useNavigate()
  const [AnalysisData, setAnalysisData] = useState([])



  useEffect(() => {

    async function fetchListings() {
      try {
        //can not send body in get request we use params here and in backend we use req.query
        const response = await axios.get('http://localhost:5000/property/get/user/listings', {
          params: { ID: userId }
        });
        if (response.status === 200) {
          setListings(response.data.Result);
        } else {
          console.error("Failed to fetch listings");
        }
      }
      catch (err) {
        console.error("Error fetching listings:", err);
      }
    }
    fetchListings()
  }, [userId])

  async function handleDelete(id) {
    
    try {
      let response = await axios.delete('http://localhost:5000/property/delete/by-PropertID', {
        params: { Propertyid: id }
      })
      if (response.status === 200) {
        console.log("Property deleted successfully");
        // Remove the deleted property from the listings state for state change to reload the component 
        // returning all the elements except where PropertyID is equal to the id
        setListings((listings) => listings.filter(item => item.PropertyID !== id));
        // Also remove the deleted property from the PropertyData context
        setPropertyData((PropertyData) => PropertyData.filter(item => item.PropertyID !== id));
        
      }
    }
    catch (err) {
      console.error("Error deleting property:", err);
    }
  }

  function handleUpdate(item) {
      console.log("item", item)
      navigate('/update/Property', { state: item })
    }

  useEffect(() => {
    async function Anlysis(){
      try {

        const response = await axios.get('http://localhost:5000/property/get/Analytics', {
          params: { userID: userId }
        });

        if (response.status === 200) {
          setAnalysisData(response.data.result.recordsets);
        } else {
          console.error("Failed to fetch listings");
        }
      }
      catch (err) {
        console.error("Error fetching listings:", err);
      }
    }

    Anlysis()
  },[userId])

  console.log("Analysis Data", AnalysisData)
 
  return (  
    <div>
    <Navbar/>

    <Box
      sx={{
        m: 4,
        maxWidth: '1200px',
        mx: 'auto',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 2,
        p: 3,
      }}
    >
      
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
        Your Listed Properties
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>

          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >S.no</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Address</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >City</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Purpose</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Area</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Update</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', }} >Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No listings found.
                </TableCell>
              </TableRow>
            ) : (
              listings.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#f9f9f9',
                    },
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.Address}</TableCell>
                  <TableCell>{item.Type}</TableCell>
                  <TableCell>{item.City}</TableCell>
                  <TableCell>{item.Purpose}</TableCell>
                  <TableCell>{item.Area} Sqft</TableCell>
                  <TableCell>{item.Amount}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleUpdate(item)} sx={{backgroundColor: 'yellow', color: 'black'}} >Update</Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={ () => handleDelete(item.PropertyID)} sx={{backgroundColor: 'red', color: 'white'}}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
            
    <Analytics data={AnalysisData}/>
    </div>
  );
};

export default Listings;
