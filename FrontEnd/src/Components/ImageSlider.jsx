import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, 
        autoplaySpeed: 3000,
        arrows: true,
        pauseOnHover: true 
    };

    return (
        <div className='w-[100%]'>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index}>
                        <img
                            src={`http://localhost:5000/uploads/${img}`}
                            alt={`Image ${index + 1}`}
                            className='w-full h-[300px] object-cover'
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;