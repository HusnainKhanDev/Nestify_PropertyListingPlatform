import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import Cookies from 'js-cookie';

const RouteProtector = ({ children }) => {
    const navigate = useNavigate();
    const [Loading, setLoading] = useState(true);
    const { setUserData } = useContext(UserDataContext);
    let token = Cookies.get('token')

    useEffect(() => {
    
        if (!token) {
            navigate('/');
            return;
        }

        async function protectRoutes() {
            try {
                const response = await axios.get('http://localhost:5000/users/get/profile', { withCredentials: true });
                console.log("User protector", response);

                if (response.data.result?.rowsAffected?.[0] > 0) {
                    setUserData(response.data.result?.recordsets?.[0]?.[0] || {});
                    setLoading(false);
                } 
                else{
                    navigate('/');
                }
            }
            catch(error){
                console.log(error);
                navigate('/');
            }
        }
        protectRoutes();
    }, [navigate]);

    if (Loading) {
        return (
            <div>
                <img src="https://cssbud.com/wp-content/uploads/2022/05/loading.gif" alt="" className='ml-[32%]' />
                <h1 className="text-center text-3xl mt-10 font-semibold">Loading....</h1>
                <h1 className="text-center text-3xl font-semibold">Return to Login page</h1>
            </div>
        );
    }

    return <>{children}</>;
};

export default RouteProtector;
