import { Box, TextField, Typography, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const UpdateProperty = () => {

  const location = useLocation()
  let Data = location.state
  console.log("Data", Data)

  const navigate = useNavigate()

  const [ok, setOk] = useState(false);
  const [Address, setAddress] = useState(Data.Address)
  const [Purpose, setPurpose] = useState(Data.Purpose)
  const [City, setCity] = useState(Data.City)
  const [Type, setType] = useState(Data.Type)
  const [Area, setArea] = useState(Data.Area)
  const [Description, setDescription] = useState(Data.Description)
  const [Amount, setAmount] = useState(Data.Amount)
  const [PropertyID, setPropertyID] = useState(Data.PropertyID)


  if (ok) setTimeout(() => {setOk(false)}, 4000);
  

  async function handleUpdate() {
    console.log("Update Property")
    const formData = {
      Address: Address,
      Purpose: Purpose,
      City: City,
      Type: Type,
      Area: Area,
      Description: Description,
      Amount: Amount,
      PropertyID: PropertyID
    }
    try{
      let response = await axios.patch("http://localhost:5000/property/update", formData )
      if(response.status === 200){
        toast.success('Property Updated successfully!')
        setOk(true)
      }
    }
    catch(err){
      console.log("Error while Updating", err)
    }
  }



  return (
    <Box className="bg-opacity-70 flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-800 h-screen w-full">
      <div onClick={() => navigate('/Property/Listing')}>
        <i className="ri-arrow-go-back-line absolute cursor-pointer top-5 left-5 text-white text-2xl ">Back</i>
      </div>

      {
        ok && ok === true ?
        (<div className='z-50 absolute top-10 '>
          <img src="/celebrate.gif" alt="" />
        </div>) : null
      }
      
      <Box className="bg-white w-[90%] md:w-[70%] lg:w-[40%] h-auto rounded-xl p-8 shadow-2xl space-y-6">
        
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Update Property
        </Typography>

        <div className="flex flex-col gap-4 mt-2">
          <TextField
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            label="Address"
            variant="outlined"
            fullWidth
            size="small"
          />

          <Select
            value={Purpose}
            onChange={(e) => setPurpose(e.target.value)}
            label="Purpose"
            variant="outlined"
            fullWidth
            size="small"
          >
            <MenuItem value={'Rent'}>Rent</MenuItem>
            <MenuItem value={'Sale'}>Sale</MenuItem>
          </Select>

            <TextField
              value={Type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
              variant="outlined"
              fullWidth
              size="small"
            />

          <Box className="flex gap-4">
            <TextField
              value={City}
              onChange={(e) => setCity(e.target.value)}
              label="City"
              variant="outlined"
              fullWidth
              size="small"
            />
            <TextField
              value={Area}
              onChange={(e) => setArea(e.target.value)}
              label="Area (sqft)"
              variant="outlined"
              fullWidth
              size="small"
              type="number"
            />
          </Box>

          <TextField
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            variant="outlined"
            fullWidth
            size="small"
            multiline
            rows={2}
          />

          <TextField
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Amount (PKR)"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
          />

          <Button onClick={handleUpdate} variant="outlined" disableElevation className=" font-semibold mt-4 border-2 border-blue-700 text-blue-700 bg-transparent hover:bg-blue-700 hover:text-white transition-all duration-200"fullWidth>
            Update
          </Button>
          
        </div>
        <p className='text-[#b4b2b2]'>You can only update textual information not images!</p>
      </Box>
            <ToastContainer 
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"  // or "dark", "light"
           />
    </Box>
  );
};

export default UpdateProperty;
