import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext'

const Login = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Error, setError] = useState('');

    const navigate = useNavigate();
    const { UserData, setUserData } = useContext(UserDataContext);

    const Userdata = {
        Email: Email,
        Password: Password
    }

    async function FormHandler(e) {
        e.preventDefault();

        let response;
        try {
            response = await axios.post('http://localhost:5000/users/login', Userdata, { withCredentials: true });
            if (response.status === 200) {
                setUserData(response.data.user.recordset[0]);
                localStorage.setItem('User', JSON.stringify(response.data.user.recordset[0]));
                navigate('/home')
            }
        }
        catch (err) {
            console.log(err);
            let ErrorMsg = err.response.data.msg || err.response.data.errors[0];
            setError(ErrorMsg);
        }

    }

    if(Error){
        setTimeout(() => { setError('') }, 2000)
    }

    return (
        <div>
            <div className='p-5 bg-gray-900 text-white'>
                <div className='p-5 bg-gray-700 rounded-lg shadow-lg'>
                    <h1 className='ml-[35%] text-4xl -mt-2 mb-6 text-white font-serif'>Login</h1>

                    <form className=' flex justify-center flex-col h-full' onSubmit={(e) => FormHandler(e)}>

                        <label className="text-xl py-1 text-white mt-1">Email</label>
                        <input value={Email} onChange={(e) => setEmail(e.target.value)} type="email" className="p-2  rounded-md border-2 border-white-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400" />


                        <label className="text-xl py-1  text-white mt-8">Password</label>
                        <input value={Password} onChange={(e) => setPassword(e.target.value)} type="password" className="p-2 rounded-md border-2 border-white-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400" />
                        
                        <div className='text-red-600 font-semibold text-lg mb-3 h-6 mt-2'>
                            <p>{Error}</p>
                        </div>

                        <button className='bg-green-500 text-white font-medium py-2 w-[95%] ml-2 mt-5 rounded-full text-lg shadow-md hover:bg-green-600'>
                            Submit
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login