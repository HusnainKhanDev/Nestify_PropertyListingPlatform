import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';


const Cards = ({ PropertyData, setDetails}) => {
  return (
    PropertyData && PropertyData.length > 0 ? (
      <div className='flex gap-7 flex-wrap justify-center'>
        {PropertyData.map((P, index) => (
          <Card 
            onClick={() => setDetails(P)}
            key={index} sx={{
            maxWidth: 345,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            color: 'black',
            boxShadow: 5,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: 10,
            },
          }}>

            <CardMedia
              component="img"
              sx={{
                height: '180px',
                width: '100%', // make image fill the card width
                objectFit: 'cover', // crop without stretching
              }}
              image={`http://localhost:5000/uploads/${P.MainImage}`}
              alt="Property Image"
            />

            <CardContent sx={{ color: 'black' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Rs: {P.Amount}</Typography>
                <Typography variant="body2">{P.Area} Sqft</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body1">{P.City}</Typography>
                <Typography variant="body1">{P.Purpose}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-3xl font-bold'>No Properties Found</h1>
      </div>
    )
  );
};

export default Cards;
