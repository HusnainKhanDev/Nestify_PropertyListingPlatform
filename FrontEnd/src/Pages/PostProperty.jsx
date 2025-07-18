import React, { useState } from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import 'remixicon/fonts/remixicon.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../Context/UserContext'
import { PropertyDataContext } from '../Context/PropertyContext'
import { useContext } from 'react'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';



const PostProperty = () => {

  const [Address, setAddress] = useState('')
  const [Purpose, setPurpose] = useState('')
  const [City, setCity] = useState('')
  const [Area, setArea] = useState('')
  const [Description, setDescription] = useState('')
  const [Amount, setAmount] = useState('')
  const [Type, setType] = useState('')
  const [MainImage, setMainImage] = useState("")
  const [SubImage1, setSubImage1] = useState("")
  const [SubImage2, setSubImage2] = useState("")

  const navigate = useNavigate()
  const { UserData } = useContext(UserDataContext)
  const { fetchPropertyData } = useContext(PropertyDataContext)
  const userId = UserData?.UserID

  async function handleSubmit() {
    const formData = new FormData();
    formData.append('Address', Address);
    formData.append('Purpose', Purpose);
    formData.append('City', City);
    formData.append('Area', Area);
    formData.append('Description', Description);
    formData.append('Amount', Amount);
    formData.append('UserID', userId);
    formData.append('Type', Type);
    formData.append('MainImage', MainImage);
    formData.append('SubImage1', SubImage1);
    formData.append('SubImage2', SubImage2);

    try {
      let response = await axios.post('http://localhost:5000/property/create/listing', formData)
      console.log("Response from server", response)
      if (response.status === 200) {
         toast.success('🏠 Property posted successfully!')
          setAddress('');
          setPurpose('');
          setCity('');
          setArea('');
          setType('');
          setDescription('');
          setAmount('');
          setMainImage('');
          setSubImage1('');
          setSubImage2('');
      }
    }
    catch (error) {
      toast.error(error.response.data.errors[0])
      console.log(error)
    }

  }

  function handleBack() {
    // fetchPropertyData();
    navigate('/home',)
  }

  return (
    <div className='bg-[url("/Pbg2.jpg")] bg-cover bg-center h-screen w-screen flex items-center justify-center'>
      <div>
        <i onClick={handleBack} className="ri-arrow-go-back-line absolute cursor-pointer top-5 left-5 text-white text-2xl ">Back</i>
      </div>
      <Box
        sx={{
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          boxShadow: 10,
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          gap: 1.8,
          margin: 'auto',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(150, 150, 150, 0.10)', // semi-transparent white
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mt={-3}  sx={{ fontFamily: '"Delius", cursive' }} >
          Post a Property
        </Typography>

        <TextField
          value={Address}
          onChange={(e) => setAddress(e.target.value)}
          label="Address"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#ffffff', }, '&:hover fieldset': { borderColor: '#ffffff', }, '&.Mui-focused fieldset': { borderColor: '#ffffff', }, }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff', } }} />

        <FormControl fullWidth size="small" sx={{
          backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: '#ffffff' },
            '&:hover fieldset': { borderColor: '#ffffff' },
            '&.Mui-focused fieldset': { borderColor: '#ffffff' }
          },
          '& .MuiInputLabel-root': { color: '#ffffff' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff' }
        }}>
          <InputLabel id="purpose-label">Purpose</InputLabel>
          <Select
            labelId="purpose-label"
            value={Purpose}
            label="Purpose"
            onChange={(e) => setPurpose(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiSelect-icon': { color: 'white' },
            }}
          >
            <MenuItem value={'Rent'}>Rent</MenuItem>
            <MenuItem value={'Sale'}>Sale</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField value={City} onChange={(e) => setCity(e.target.value)} label="City" variant="outlined" type="text" size="small" fullWidth sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#ffffff', }, '&:hover fieldset': { borderColor: '#ffffff', }, '&.Mui-focused fieldset': { borderColor: '#ffffff', }, }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff', } }} />
          <TextField value={Area} onChange={(e) => setArea(e.target.value)} label="Area (sqft)" variant="outlined" type="number" size="small" fullWidth sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#ffffff', }, '&:hover fieldset': { borderColor: '#ffffff', }, '&.Mui-focused fieldset': { borderColor: '#ffffff', }, }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff', } }} />
        </Box>

        <TextField value={Description} onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" multiline rows={2} fullWidth sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#ffffff', }, '&:hover fieldset': { borderColor: '#ffffff', }, '&.Mui-focused fieldset': { borderColor: '#ffffff', }, }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff', } }} />
        <TextField value={Amount} onChange={(e) => setAmount(e.target.value)} label="Amount" variant="outlined" type="number" size="small" fullWidth sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#ffffff', }, '&:hover fieldset': { borderColor: '#ffffff', }, '&.Mui-focused fieldset': { borderColor: '#ffffff', }, }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff', } }} />
        <TextField value={Type} onChange={(e) => setType(e.target.value)} label="Type" variant="outlined" type="text" size="small" fullWidth sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#ffffff', }, '&:hover fieldset': { borderColor: '#ffffff', }, '&.Mui-focused fieldset': { borderColor: '#ffffff', }, }, '& .MuiInputLabel-root': { color: '#ffffff', }, '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff', } }} />
        <input onChange={(e) => setMainImage(e.target.files[0])} type="file" className="w-full px-3 py-2 bg-white/30 text-white rounded-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/50 file:text-black hover:file:bg-white" />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2 }}>
          <input onChange={(e) => setSubImage1(e.target.files[0])} type="file" className="w-full px-3 py-2 bg-white/30 text-white rounded-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/50 file:text-black hover:file:bg-white" />
          <input onChange={(e) => setSubImage2(e.target.files[0])} type="file" className="w-full px-3 py-2 bg-white/30 text-white rounded-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/50 file:text-black hover:file:bg-white" />
        </Box>

        <Button variant="contained" color="primary" sx={{ }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"  // or "dark", "light"
     />


    </div>
  )
}

export default PostProperty
