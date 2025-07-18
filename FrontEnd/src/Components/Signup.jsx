import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {UserDataContext} from '../Context/UserContext'
import { useContext } from 'react';


const Signup = () => {

  const { UserData, setUserData } = useContext(UserDataContext);

  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [Error, setError] = useState('')
  const navigate = useNavigate();

  const Userdata = {
    Name: Name,
    Email: Email,
    Phone: Phone,
    Password: Password
  }

  async function FormHandler(e){
    e.preventDefault();
    try{
      let response = await axios.post('http://localhost:5000/users/signup', Userdata, { withCredentials: true });

      if(response.data.result.rowsAffected[0] > 0){
        setUserData(response.data.result.recordset[0]);
        localStorage.setItem('User', JSON.stringify(response.data.result.recordset[0]));
        navigate('/home');
      }

    }
    catch(err){
      console.log(err);
      setError(err.response.data.msg || err.response.data.errors[0])
    }
  }

  if(Error){
    setTimeout(() => { setError('') }, 2000)
  }


  return (
    <div>
        <div className='p-5 bg-gray-900 text-white'>
            <div className='p-5 py-8 bg-gray-700 rounded-lg shadow-lg'>
            <h1 className=' text-2xl text-center -mt-5  text-white font-serif'>Sign Up</h1>

            <form className=' flex justify-center flex-col gap-1'  onSubmit={(e) => FormHandler(e)}>
                <label className="text-sm text-white">Name</label>
                <input value={Name} onChange={e => setName(e.target.value)} required type="text" className="p-1 px-3 rounded-md border-2 border-white-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400" />

                <label className="text-sm py-1 text-white mt-1">Email</label>
                <input value={Email} onChange={e => setEmail(e.target.value)} required type="email" className="p-1 px-3 rounded-md border-2 border-white-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400" />

                <label className="text-sm py-1 text-white mt-1">Phone No</label>
                <input value={Phone} onChange={e => setPhone(e.target.value)} required type="text" className="p-1 px-3 rounded-md border-2 border-white-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400" />

                <label className="text-sm py-1 text-white mt-1">Password</label>
                <input value={Password} onChange={e => setPassword(e.target.value)} required type="password" className="p-1 px-3 rounded-md border-2 border-white-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400" />
               
                <p className="text-red-400 mt-1 h-8">{Error}</p>

                <button className='bg-green-500 text-white font-medium py-2 w-[95%] ml-2  rounded-full text-lg shadow-md hover:bg-green-600'>  
                Submit
                </button>

            </form>

        </div>
        </div>
    </div>
  )
}

export default Signup